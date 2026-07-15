// src/routes/contacts.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authenticate = require('../middleware/auth');

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags:
 *       - Contacts
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', authenticate, contactController.getAll);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve a contact by ID
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 */
router.get('/:id', authenticate, contactController.getById);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.post('/', authenticate, contactController.create);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags:
 *       - Contacts
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
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.put('/:id', authenticate, contactController.update);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags:
 *       - Contacts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted
 */
router.delete('/:id', authenticate, contactController.delete);

module.exports = router;
