'use strict';

require('dotenv').config();

const express      = require('express');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const path         = require('path');

const authRoutes  = require('./routes/auth');
const taskRoutes  = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: `http://localhost:${PORT}`,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── Static files ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ──────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

// ── SPA fallback – serve index.html for unknown routes ──────
app.get('/{*path}', (req, res) => {
  // Only fall back for non-API routes
  if (!req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  return res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  🚀  TaskVault server running at http://localhost:${PORT}`);
  console.log(`  📂  SQLite database: ./database/taskvault.db`);
  console.log(`  🌍  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
