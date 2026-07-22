const express = require('express');
const router = express.Router();
const courrierController = require('../controllers/courrierController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Courriers
 *   description: Gestion des courriers
 */

/**
 * @swagger
 * /api/courriers:
 *   get:
 *     summary: Récupérer tous les courriers
 *     tags: [Courriers]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courriers
 */
router.get('/', authenticate, courrierController.getAll);

/**
 * @swagger
 * /api/courriers/ready-to-archive:
 *   get:
 *     summary: Récupérer les courriers éligibles à l'archivage (toutes les tâches terminées)
 *     tags: [Courriers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courriers prêts à être archivés
 */
router.get('/ready-to-archive', authenticate, courrierController.readyToArchive);

router.post('/scan', authenticate, upload.array('documents', 50), courrierController.scan);
router.post('/upload', authenticate, upload.array('documents', 50), courrierController.uploadScan);
router.post('/ocr', authenticate, courrierController.ocr);
router.post('/:id/ocr', authenticate, courrierController.ocr);
router.get('/:id/pdf', authenticate, courrierController.viewPdf);
router.get('/:id/download', authenticate, courrierController.downloadPdf);
router.delete('/:id/pdf', authenticate, courrierController.deletePdf);

/**
 * @swagger
 * /api/courriers/{id}:
 *   get:
 *     summary: Récupérer un courrier par son ID
 *     tags: [Courriers]
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
 *         description: Détails du courrier
 */
router.get('/:id', authenticate, courrierController.getById);

/**
 * @swagger
 * /api/courriers:
 *   post:
 *     summary: Créer un nouveau courrier (avec fichier joint optionnel)
 *     tags: [Courriers]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *               type:
 *                 type: string
 *               fichier_joint:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Courrier créé
 */
router.post('/', authenticate, upload.fields([{ name: 'documents', maxCount: 50 }, { name: 'fichier_joint', maxCount: 1 }]), courrierController.create);

/**
 * @swagger
 * /api/courriers/{id}:
 *   put:
 *     summary: Mettre à jour un courrier existant
 *     tags: [Courriers]
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
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Courrier mis à jour
 */
router.put('/:id', authenticate, upload.fields([{ name: 'documents', maxCount: 50 }, { name: 'fichier_joint', maxCount: 1 }]), courrierController.update);

/**
 * @swagger
 * /api/courriers/{id}:
 *   delete:
 *     summary: Supprimer un courrier
 *     tags: [Courriers]
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
 *         description: Courrier supprimé
 */
router.delete('/:id', authenticate, courrierController.delete);

module.exports = router;
