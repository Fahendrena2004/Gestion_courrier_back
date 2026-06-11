// src/routes/courriers.js
const express = require('express');
const router = express.Router();
const courrierController = require('../controllers/courrierController');
const authenticate = require('../middleware/auth');

/**
 * @swagger
 * /api/courriers:
 *   get:
 *     summary: Retrieve all courriers
 *     tags:
 *       - Courriers
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of courriers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Courrier'
 */
router.get('/', authenticate, courrierController.getAll);

/**
 * @swagger
 * /api/courriers/{id}:
 *   get:
 *     summary: Retrieve a courrier by ID
 *     tags:
 *       - Courriers
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Courrier ID
 *     responses:
 *       200:
 *         description: Courrier object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courrier'
 *       404:
 *         description: Courrier not found
 */
router.get('/:id', authenticate, courrierController.getById);

/**
 * @swagger
 * /api/courriers:
 *   post:
 *     summary: Create a new courrier
 *     tags:
 *       - Courriers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Courrier'
 *     responses:
 *       201:
 *         description: Courrier created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courrier'
 */
router.post('/', authenticate, courrierController.create);

/**
 * @swagger
 * /api/courriers/{id}:
 *   put:
 *     summary: Update a courrier
 *     tags:
 *       - Courriers
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
 *             $ref: '#/components/schemas/Courrier'
 *     responses:
 *       200:
 *         description: Courrier updated
 */
router.put('/:id', authenticate, courrierController.update);

/**
 * @swagger
 * /api/courriers/{id}:
 *   delete:
 *     summary: Delete a courrier
 *     tags:
 *       - Courriers
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
 *         description: Courrier deleted
 */
router.delete('/:id', authenticate, courrierController.delete);

module.exports = router;
