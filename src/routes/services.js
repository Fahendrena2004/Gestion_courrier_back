const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validate');
const serviceSchema = require('../validation/serviceSchema');
/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Retrieve all services
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', authenticate, serviceController.getAll);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Retrieve a service by ID
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 */
router.get('/:id', authenticate, serviceController.getById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 */
router.post('/', authenticate, validate(serviceSchema), serviceController.create);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated
 */
router.put('/:id', authenticate, validate(serviceSchema), serviceController.update);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags:
 *       - Services
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete('/:id', authenticate, serviceController.delete);

module.exports = router;
