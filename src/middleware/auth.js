const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
  // token can be sent in Authorization header as Bearer token or as a cookie named 'token'
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.cookies?.token;
  console.log('Auth middleware: received token', token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.sendStatus(403);
    }
    req.user = user; // payload contains at least { id, email }
    next();
  });
}

module.exports = authenticateToken;
