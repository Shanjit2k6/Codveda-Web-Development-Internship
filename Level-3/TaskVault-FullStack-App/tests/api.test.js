/**
 * TaskVault – Automated API Test Suite
 * Run: node tests/api.test.js
 * Requires server to be running on localhost:3000
 */
'use strict';

const BASE = 'http://localhost:3000';
let cookie = '';
let taskId = null;

const results = [];
let passed = 0, failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅  ${name}`);
    results.push({ name, status: 'PASS' });
    passed++;
  } catch (err) {
    console.log(`  ❌  ${name}`);
    console.log(`       → ${err.message}`);
    results.push({ name, status: 'FAIL', error: err.message });
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  let json;
  try { json = await res.json(); } catch { json = {}; }
  return { status: res.status, json };
}

console.log('\n🧪 TaskVault API Test Suite\n');

// Run all tests
(async () => {
  // ── Auth Tests ───────────────────────────────────────────
  console.log('── Authentication ──');

  await test('1. Register new user', async () => {
    const { status, json } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: `test_${Date.now()}@taskvault.test`, password: 'password123' }),
    });
    assert(status === 201, `Expected 201, got ${status}`);
    assert(json.success === true, 'Expected success=true');
    assert(json.user && json.user.id, 'Expected user with id');
    assert(!json.user.password_hash, 'Password hash must not be exposed');
  });

  await test('2. Duplicate email registration rejected (409)', async () => {
    const email = `dup_${Date.now()}@taskvault.test`;
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'First', email, password: 'password123' }),
    });
    cookie = ''; // reset
    const { status, json } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Second', email, password: 'password123' }),
    });
    assert(status === 409, `Expected 409, got ${status}`);
    assert(json.success === false, 'Expected failure');
  });

  await test('3. Login with correct credentials', async () => {
    const email = `login_${Date.now()}@taskvault.test`;
    cookie = '';
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Login Test', email, password: 'mypassword' }),
    });
    cookie = '';
    const { status, json } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'mypassword' }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.user && json.user.email === email, 'Returned wrong user');
  });

  await test('4. Login with wrong password rejected (401)', async () => {
    const email = `wp_${Date.now()}@taskvault.test`;
    cookie = '';
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'WP Test', email, password: 'correctpass' }),
    });
    cookie = '';
    const { status } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'wrongpass' }),
    });
    assert(status === 401, `Expected 401, got ${status}`);
  });

  // Register fresh user for task tests
  cookie = '';
  const testEmail = `tasks_${Date.now()}@taskvault.test`;
  await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Task Tester', email: testEmail, password: 'taskpass123' }),
  });

  await test('5. /api/auth/me returns user when authenticated', async () => {
    const { status, json } = await api('/api/auth/me');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.user && json.user.email === testEmail, 'Returned wrong user');
    assert(!json.user.password_hash, 'Password hash must not be exposed');
  });

  await test('6. Unauthenticated request to /api/tasks returns 401', async () => {
    const savedCookie = cookie;
    cookie = '';
    const { status } = await api('/api/tasks');
    cookie = savedCookie;
    assert(status === 401, `Expected 401, got ${status}`);
  });

  // ── Task CRUD Tests ──────────────────────────────────────
  console.log('\n── Task CRUD ──');

  await test('7. Create a task', async () => {
    const { status, json } = await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Task Alpha', description: 'Automated test task', priority: 'high', due_date: '2025-12-31' }),
    });
    assert(status === 201, `Expected 201, got ${status}`);
    assert(json.task && json.task.id, 'Expected task with id');
    assert(json.task.title === 'Test Task Alpha', 'Wrong title');
    taskId = json.task.id;
  });

  await test('8. Read all tasks', async () => {
    const { status, json } = await api('/api/tasks');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(Array.isArray(json.tasks), 'Expected tasks array');
    assert(json.tasks.some(t => t.id === taskId), 'Created task not found in list');
  });

  await test('9. Read single task', async () => {
    const { status, json } = await api(`/api/tasks/${taskId}`);
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.task.id === taskId, 'Wrong task returned');
  });

  await test('10. Update task', async () => {
    const { status, json } = await api(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated Task Alpha', priority: 'medium', completed: false }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.task.title === 'Updated Task Alpha', 'Title not updated');
    assert(json.task.priority === 'medium', 'Priority not updated');
  });

  await test('11. Mark task as completed', async () => {
    const { status, json } = await api(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated Task Alpha', priority: 'medium', completed: true }),
    });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.task.completed === 1, 'Task not marked completed');
  });

  await test('12. Filter by status=completed', async () => {
    const { status, json } = await api('/api/tasks?status=completed');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.tasks.every(t => t.completed === 1), 'Non-completed tasks in completed filter');
  });

  await test('13. Search tasks by title', async () => {
    const { status, json } = await api('/api/tasks?search=Updated+Task');
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.tasks.some(t => t.id === taskId), 'Task not found in search');
  });

  await test('14. Task isolation – other users cannot access tasks', async () => {
    // Register a second user
    const oldCookie = cookie;
    cookie = '';
    const email2 = `other_${Date.now()}@taskvault.test`;
    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Other User', email: email2, password: 'otherpass123' }),
    });

    const { status } = await api(`/api/tasks/${taskId}`);
    assert(status === 404, `Expected 404 (ownership), got ${status}`);
    cookie = oldCookie; // restore
  });

  await test('15. Delete task', async () => {
    const { status, json } = await api(`/api/tasks/${taskId}`, { method: 'DELETE' });
    assert(status === 200, `Expected 200, got ${status}`);
    assert(json.success === true, 'Expected success');
  });

  await test('16. Task not found after deletion', async () => {
    const { status } = await api(`/api/tasks/${taskId}`);
    assert(status === 404, `Expected 404 after delete, got ${status}`);
  });

  await test('17. Logout clears session', async () => {
    const { status } = await api('/api/auth/logout', { method: 'POST' });
    assert(status === 200, `Expected 200, got ${status}`);
    // Cookie is cleared by server; next /me should fail
    const { status: meStatus } = await api('/api/auth/me');
    assert(meStatus === 401, `Expected 401 post-logout, got ${meStatus}`);
  });

  // ── Summary ──────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log(`📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
  } else {
    console.log('⚠️  Some tests failed. See above for details.\n');
    process.exit(1);
  }
})().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
