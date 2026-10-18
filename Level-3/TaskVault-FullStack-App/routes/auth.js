'use strict';

const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../database/db');

const router = express.Router();

const SALT_ROUNDS  = 12;
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure:   process.env.NODE_ENV === 'production',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

// Helper – issue JWT and set cookie
function issueToken(res, user) {
  const payload = { id: user.id, name: user.name, email: user.email };
  const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, COOKIE_OPTIONS);
  return token;
}

// ────────────────────────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // Check duplicate email
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const insert = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    );
    const result = insert.run(name.trim(), email.toLowerCase(), password_hash);

    const user = { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase() };
    issueToken(res, user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ────────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    issueToken(res, user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ────────────────────────────────────────────────────────────
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  return res.status(200).json({ success: true, user });
});

// ────────────────────────────────────────────────────────────
// POST /api/auth/logout
// ────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

module.exports = router;
