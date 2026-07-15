const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');
const config = require('./config');

// Login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
  try {
    const [rows] = await db.query('SELECT id, password, role FROM users WHERE email = ? AND deleted_at IS NULL', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Identifiants invalides' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '8h' });
    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });
    res.json({ message: 'Connecté', token, role: user.role });
  } catch (err) {
    next(err);
  }
});

// Register
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hash, 'agent']);
    res.status(201).json({ id: result.insertId, username, email });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnecté' });
});

module.exports = router;
