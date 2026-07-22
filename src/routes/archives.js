// src/routes/archives.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');
const archiveController = require('../controllers/archiveController');
const validate = require('../middleware/validate');
const archiveSchema = require('../validation/archiveSchema');
const paginate = require('../middleware/pagination');

/**
 * @swagger
 * /api/archives:
 *   get:
 *     summary: Retrieve all archives
 *     tags:
 *       - Archives
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of archives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Archive'
 */
router.get('/', authenticate, paginate, archiveController.getAll);

/**
 * @swagger
 * /api/archives/{id}:
 *   get:
 *     summary: Retrieve an archive by ID
 *     tags:
 *       - Archives
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Archive ID
 *     responses:
 *       200:
 *         description: Archive object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archive'
 *       404:
 *         description: Archive not found
 */
router.get('/:id', authenticate, archiveController.getById);

/**
 * @swagger
 * /api/archives:
 *   post:
 *     summary: Create a new archive
 *     tags:
 *       - Archives
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Archive'
 *     responses:
 *       201:
 *         description: Archive created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Archive'
 */
router.post(
  '/',
  authenticate,
  upload.single('file'),
  (req, res, next) => {
    if (req.file) {
      req.body.path = req.file.path;
    }
    next();
  },
  validate(archiveSchema),
  archiveController.create
);

/**
 * @swagger
 * /api/archives/{id}:
 *   put:
 *     summary: Update an archive
 *     tags:
 *       - Archives
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
 *             $ref: '#/components/schemas/Archive'
 *     responses:
 *       200:
 *         description: Archive updated
 */
router.put(
  '/:id',
  authenticate,
  upload.single('file'),
  (req, res, next) => {
    if (req.file) {
      req.body.path = req.file.path;
    }
    next();
  },
  validate(archiveSchema),
  archiveController.update
);

/**
 * @swagger
 * /api/archives/{id}:
 *   delete:
 *     summary: Delete an archive
 *     tags:
 *       - Archives
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
 *         description: Archive deleted
 */
router.delete('/:id', authenticate, archiveController.delete);

module.exports = router;
