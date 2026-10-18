/* dashboard.js – Full task management logic for TaskVault dashboard */
'use strict';

// ── State ────────────────────────────────────────────────────
let allTasks     = [];
let currentUser  = null;
let filterStatus = 'all';
let filterPri    = '';
let searchQuery  = '';
let deletePendingId = null;

// ── DOM refs ─────────────────────────────────────────────────
const taskListEl       = document.getElementById('taskList');
const loadingSkel      = document.getElementById('loadingSkeleton');
const statTotal        = document.getElementById('statTotal');
const statDone         = document.getElementById('statDone');
const statPending      = document.getElementById('statPending');
const sidebarUserName  = document.getElementById('sidebarUserName');
const sidebarUserEmail = document.getElementById('sidebarUserEmail');
const userAvatarLetter = document.getElementById('userAvatarLetter');
const topbarAvatar     = document.getElementById('topbarAvatar');
const topbarGreeting   = document.getElementById('topbarGreeting');
const welcomeMsg       = document.getElementById('welcomeMsg');
const topbarDate       = document.getElementById('topbarDate');

// ── Bootstrap ────────────────────────────────────────────────
(async function init() {
  // Set date
  topbarDate.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Auth check
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) { window.location.replace('/login.html'); return; }
    const { user } = await res.json();
    currentUser = user;
    applyUserUI(user);
  } catch {
    window.location.replace('/login.html');
    return;
  }

  await loadTasks();
  attachEventListeners();
})();

// ── UI helpers ───────────────────────────────────────────────
function applyUserUI(user) {
  const letter = (user.name || 'U')[0].toUpperCase();
  sidebarUserName.textContent  = user.name;
  sidebarUserEmail.textContent = user.email;
  userAvatarLetter.textContent = letter;
  topbarAvatar.textContent     = letter;

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  topbarGreeting.textContent = `${greet}, ${user.name.split(' ')[0]}!`;
  welcomeMsg.textContent     = `${greet}, ${user.name.split(' ')[0]}! 👋`;
}

// ── API helpers ──────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
  const defaults = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  return fetch(url, { ...defaults, ...opts, headers: { ...defaults.headers, ...(opts.headers || {}) } });
}

// ── Load tasks ───────────────────────────────────────────────
async function loadTasks() {
  loadingSkel.style.display   = 'flex';
  taskListEl.style.display    = 'none';
  try {
    const res  = await apiFetch('/api/tasks');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    allTasks = data.tasks || [];
    renderTasks();
  } catch (err) {
    showToast('error', err.message || 'Failed to load tasks.');
  } finally {
    loadingSkel.style.display = 'none';
    taskListEl.style.display  = 'flex';
  }
}

// ── Render tasks ─────────────────────────────────────────────
function renderTasks() {
  // Filter
  let tasks = allTasks.filter(t => {
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterStatus === 'pending'   && t.completed)  return false;
    if (filterPri && t.priority !== filterPri)         return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !(t.description || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Stats (always based on ALL tasks)
  const total   = allTasks.length;
  const done    = allTasks.filter(t => t.completed).length;
  const pending = total - done;
  statTotal.textContent   = total;
  statDone.textContent    = done;
  statPending.textContent = pending;

  // Render
  if (tasks.length === 0) {
    taskListEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${searchQuery || filterStatus !== 'all' || filterPri ? '🔍' : '📝'}</div>
        <h3>${searchQuery || filterStatus !== 'all' || filterPri ? 'No matching tasks' : 'No tasks yet!'}</h3>
        <p style="max-width:300px;margin:0 auto;">${
          searchQuery ? 'Try a different search term or clear filters.' :
          filterStatus !== 'all' ? `You have no ${filterStatus} tasks.` :
          'Create your first task using the form above.'
        }</p>
      </div>`;
    return;
  }

  taskListEl.innerHTML = tasks.map(t => taskCardHTML(t)).join('');

  // Attach checkbox listeners
  taskListEl.querySelectorAll('.task-check').forEach(cb => {
    cb.addEventListener('change', () => toggleComplete(parseInt(cb.dataset.id), cb.checked));
  });
}

function taskCardHTML(t) {
  const priLabels = { low:'🟢 Low', medium:'🟡 Medium', high:'🔴 High' };
  const priBadge  = { low:'badge-low', medium:'badge-medium', high:'badge-high' };
  const today     = new Date().toISOString().split('T')[0];
  const overdue   = t.due_date && t.due_date < today && !t.completed;
  const dueLabel  = t.due_date
    ? `<span class="task-due ${overdue ? 'overdue':''}">📅 ${formatDate(t.due_date)}${overdue?' · Overdue':''}</span>`
    : '';

  return `
  <div class="card task-card ${t.completed ? 'completed':''}" role="listitem" data-id="${t.id}">
    <div style="padding-top:2px;">
      <input type="checkbox" class="task-check" data-id="${t.id}"
        ${t.completed ? 'checked' : ''} aria-label="Mark task as ${t.completed?'incomplete':'complete'}" />
    </div>
    <div class="task-body">
      <div class="task-title">${escHtml(t.title)}</div>
      ${t.description ? `<div class="task-desc">${escHtml(t.description)}</div>` : ''}
      <div class="task-meta">
        <span class="badge ${priBadge[t.priority]}">${priLabels[t.priority]}</span>
        ${dueLabel}
        <span class="badge ${t.completed ? 'badge-done':'badge-pending'}" style="margin-left:2px;">
          ${t.completed ? '✅ Done' : '⏳ Pending'}
        </span>
      </div>
    </div>
    <div class="task-actions">
      <button class="task-btn edit" data-id="${t.id}" aria-label="Edit task" title="Edit task">✏️</button>
      <button class="task-btn del" data-id="${t.id}" aria-label="Delete task" title="Delete task">🗑️</button>
    </div>
  </div>`;
}

function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Toggle complete ──────────────────────────────────────────
async function toggleComplete(id, completed) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;
  try {
    const res  = await apiFetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...task, completed }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const idx = allTasks.findIndex(t => t.id === id);
    allTasks[idx] = data.task;
    renderTasks();
    showToast('success', completed ? '✅ Task marked as complete!' : '⏳ Task marked as pending.');
  } catch (err) {
    showToast('error', err.message || 'Failed to update task.');
    await loadTasks(); // revert UI
  }
}

// ── Create task ──────────────────────────────────────────────
document.getElementById('createForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title    = document.getElementById('newTitle').value.trim();
  const desc     = document.getElementById('newDesc').value.trim();
  const priority = document.getElementById('newPriority').value;
  const due_date = document.getElementById('newDue').value || null;
  const errEl    = document.getElementById('newTitleError');

  if (!title) { errEl.textContent = 'Task title is required.'; return; }
  errEl.textContent = '';

  const btn = document.getElementById('createBtn');
  btn.disabled = true;
  document.getElementById('createBtnText').textContent  = 'Adding…';
  document.getElementById('createSpinner').style.display = 'inline-block';

  try {
    const res  = await apiFetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description: desc, priority, due_date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    allTasks.unshift(data.task);
    renderTasks();
    document.getElementById('createForm').reset();
    showToast('success', '✅ Task added successfully!');
  } catch (err) {
    showToast('error', err.message || 'Failed to create task.');
  } finally {
    btn.disabled = false;
    document.getElementById('createBtnText').textContent  = '➕ Add Task';
    document.getElementById('createSpinner').style.display = 'none';
  }
});

// ── Search ──────────────────────────────────────────────────
let searchDebounce;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = e.target.value.trim();
    renderTasks();
  }, 250);
});

// ── Filter tabs ──────────────────────────────────────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterStatus = tab.dataset.filter;
    renderTasks();
  });
});

// ── Priority filter ──────────────────────────────────────────
document.getElementById('priorityFilter').addEventListener('change', e => {
  filterPri = e.target.value;
  renderTasks();
});

// ── Task list event delegation (edit / delete) ───────────────
taskListEl.addEventListener('click', e => {
  const editBtn = e.target.closest('.task-btn.edit');
  const delBtn  = e.target.closest('.task-btn.del');
  if (editBtn) openEditModal(parseInt(editBtn.dataset.id));
  if (delBtn)  openDeleteConfirm(parseInt(delBtn.dataset.id));
});

// ── Edit modal ───────────────────────────────────────────────
const editModal  = document.getElementById('editModal');
const editForm   = document.getElementById('editForm');

function openEditModal(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;
  document.getElementById('editTaskId').value       = task.id;
  document.getElementById('editTitle').value        = task.title;
  document.getElementById('editDesc').value         = task.description || '';
  document.getElementById('editPriority').value     = task.priority;
  document.getElementById('editDue').value          = task.due_date || '';
  document.getElementById('editCompleted').checked  = !!task.completed;
  document.getElementById('editTitleError').textContent = '';
  editModal.classList.add('active');
  document.getElementById('editTitle').focus();
}
function closeEditModal() { editModal.classList.remove('active'); }

document.getElementById('editModalClose').addEventListener('click',  closeEditModal);
document.getElementById('editCancelBtn').addEventListener('click',   closeEditModal);
editModal.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });

document.getElementById('editSaveBtn').addEventListener('click', async () => {
  const id       = parseInt(document.getElementById('editTaskId').value);
  const title    = document.getElementById('editTitle').value.trim();
  const desc     = document.getElementById('editDesc').value.trim();
  const priority = document.getElementById('editPriority').value;
  const due_date = document.getElementById('editDue').value || null;
  const completed= document.getElementById('editCompleted').checked;
  const errEl    = document.getElementById('editTitleError');

  if (!title) { errEl.textContent = 'Title is required.'; document.getElementById('editTitle').focus(); return; }
  errEl.textContent = '';

  const saveBtn = document.getElementById('editSaveBtn');
  saveBtn.disabled = true;
  document.getElementById('editBtnText').textContent   = 'Saving…';
  document.getElementById('editSpinner').style.display = 'inline-block';

  try {
    const res  = await apiFetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description: desc, priority, due_date, completed }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    const idx = allTasks.findIndex(t => t.id === id);
    allTasks[idx] = data.task;
    renderTasks();
    closeEditModal();
    showToast('success', '✏️ Task updated successfully!');
  } catch (err) {
    showToast('error', err.message || 'Failed to update task.');
  } finally {
    saveBtn.disabled = false;
    document.getElementById('editBtnText').textContent   = 'Save Changes';
    document.getElementById('editSpinner').style.display = 'none';
  }
});

// Submit edit form on Enter in title field
document.getElementById('editTitle').addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); document.getElementById('editSaveBtn').click(); }
});

// ── Delete confirm ───────────────────────────────────────────
const confirmModal    = document.getElementById('confirmModal');
const confirmDeleteBtn= document.getElementById('confirmDeleteBtn');
const confirmCancelBtn= document.getElementById('confirmCancelBtn');
const confirmCancel   = document.getElementById('confirmCancel');

function openDeleteConfirm(id) {
  deletePendingId = id;
  confirmModal.classList.add('active');
}
function closeDeleteConfirm() {
  confirmModal.classList.remove('active');
  deletePendingId = null;
}
confirmCancelBtn.addEventListener('click', closeDeleteConfirm);
confirmCancel.addEventListener('click',    closeDeleteConfirm);
confirmModal.addEventListener('click', e => { if (e.target === confirmModal) closeDeleteConfirm(); });

confirmDeleteBtn.addEventListener('click', async () => {
  if (!deletePendingId) return;
  const id = deletePendingId;
  closeDeleteConfirm();

  try {
    const res  = await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    allTasks = allTasks.filter(t => t.id !== id);
    renderTasks();
    showToast('info', '🗑️ Task deleted.');
  } catch (err) {
    showToast('error', err.message || 'Failed to delete task.');
  }
});

// ── Logout ───────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } finally {
    showToast('info', '👋 Logged out. Redirecting…');
    setTimeout(() => window.location.replace('/login.html'), 800);
  }
});

// ── Mobile sidebar ───────────────────────────────────────────
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle     = document.getElementById('menuToggle');

function attachEventListeners() {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

// ── Keyboard – close modals on Escape ────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeEditModal();
    closeDeleteConfirm();
  }
});
