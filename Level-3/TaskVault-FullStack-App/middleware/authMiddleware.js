'use strict';

const jwt = require('jsonwebtoken');

/**
 * Middleware: Authenticate JWT from HttpOnly cookie.
 * Attaches req.user = { id, name, email } on success.
 * Returns 401 JSON on any failure.
 */
function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id:    decoded.id,
      name:  decoded.name,
      email: decoded.email,
    };
    next();
  } catch (err) {
    // Clear corrupted / expired cookie
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid. Please log in again.',
    });
  }
}

module.exports = authMiddleware;
