'use strict';

const express        = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const db             = require('../database/db');

const router = express.Router();

// All routes below require authentication
router.use(authMiddleware);

// ────────────────────────────────────────────────────────────
// GET /api/tasks  – list tasks for current user
// Query params: ?status=completed|pending  &priority=low|medium|high  &search=text
// ────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { status, priority, search } = req.query;

    let sql  = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [req.user.id];

    if (status === 'completed') {
      sql += ' AND completed = 1';
    } else if (status === 'pending') {
      sql += ' AND completed = 0';
    }

    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const q = `%${search.trim()}%`;
      params.push(q, q);
    }

    sql += ' ORDER BY created_at DESC';

    const tasks = db.prepare(sql).all(...params);

    return res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error('GET /tasks error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
});

// ────────────────────────────────────────────────────────────
// GET /api/tasks/:id  – single task
// ────────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
                   .get(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    return res.status(200).json({ success: true, task });
  } catch (err) {
    console.error('GET /tasks/:id error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch task.' });
  }
});

// ────────────────────────────────────────────────────────────
// POST /api/tasks  – create task
// ────────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const { title, description = '', priority = 'medium', due_date = null } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Priority must be low, medium, or high.' });
    }

    const insert = db.prepare(`
      INSERT INTO tasks (user_id, title, description, priority, due_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run(req.user.id, title.trim(), description.trim(), priority, due_date || null);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: 'Task created successfully.', task });
  } catch (err) {
    console.error('POST /tasks error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
});

// ────────────────────────────────────────────────────────────
// PUT /api/tasks/:id  – update task
// ────────────────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
                       .get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const {
      title       = existing.title,
      description = existing.description,
      priority    = existing.priority,
      due_date    = existing.due_date,
      completed   = existing.completed,
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Priority must be low, medium, or high.' });
    }

    db.prepare(`
      UPDATE tasks
      SET title = ?, description = ?, priority = ?, due_date = ?, completed = ?,
          updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).run(title.trim(), description.trim(), priority, due_date || null, completed ? 1 : 0,
           req.params.id, req.user.id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    return res.status(200).json({ success: true, message: 'Task updated successfully.', task });
  } catch (err) {
    console.error('PUT /tasks/:id error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
});

// ────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id  – delete task
// ────────────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const existing = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?')
                       .get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('DELETE /tasks/:id error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
});

module.exports = router;
