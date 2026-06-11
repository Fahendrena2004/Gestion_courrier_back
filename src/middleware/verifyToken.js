// src/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware that checks for a JWT token stored in a cookie named "token".
 * If the token is missing or invalid, a 401 response is sent.
 * On success, the decoded payload is attached to `req.userId` (or `req.user`).
 */
function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.id; // expose user id for controllers
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
