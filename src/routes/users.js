const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/auth');

// Get all users (protected)
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users (protected)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Get user by id (protected)
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID (protected)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Create user (public - registration)
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user (public)
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
    res.status(201).json({ id: result.insertId, username, email });
  } catch (err) {
    next(err);
  }
});

// Update user (protected)
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (protected)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Validation error
 */
router.put('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  if (!username && !email && !password) return res.status(400).json({ error: 'At least one field required' });
  try {
    const fields = [];
    const values = [];
    if (username) { fields.push('username = ?'); values.push(username); }
    if (email) { fields.push('email = ?'); values.push(email); }
    if (password) { const hash = await bcrypt.hash(password, 10); fields.push('password = ?'); values.push(hash); }
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);
    res.json({ message: 'User updated' });
  } catch (err) {
    next(err);
  }
});

// Delete user (protected)
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (protected)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
