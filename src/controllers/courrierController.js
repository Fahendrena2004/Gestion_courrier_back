// src/controllers/courrierController.js
const CourrierService = require('../services/courrierService');
const ScanService = require('../services/scanService');
const CourrierDocumentRepository = require('../repositories/courrierDocumentRepository');
const OcrService = require('../services/ocrService');
const path = require('path');

const courrierService = new CourrierService();
const scanService = new ScanService();
const courrierDocumentRepository = new CourrierDocumentRepository();
const ocrService = new OcrService();

// Helper to run OCR in background
const runOcrInBackground = async (courrierId, file, documentId) => {
    try {
        const absolutePath = path.join(__dirname, '../../uploads', file.filename);
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            const text = await ocrService.extractText(absolutePath);
            const metadata = ocrService.parseMetadata(text);
            await courrierDocumentRepository.updateOcr(courrierId, text, metadata);
        }
    } catch (error) {
        console.error('OCR failed for document:', documentId, error.message);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const rows = await courrierService.getAll(req.query);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const row = await courrierService.getById(req.params.id);
        if (!row) return res.status(404).json({ error: 'Non trouvé' });
        res.json(row);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const body = { ...req.body };
        const userId = req.user?.id || null;
        
        // Handle supplementary file
        if (req.files && req.files.fichier_joint && req.files.fichier_joint.length > 0) {
            body.file_path = req.files.fichier_joint[0].filename;
        }
        
        const result = await courrierService.create(body);

        if (req.files && req.files.documents && req.files.documents.length > 0) {
            await Promise.all(req.files.documents.map(async (file) => {
                const doc = await courrierDocumentRepository.create({
                    courrier_id: result.id,
                    file_path: file.filename,
                    original_name: file.originalname,
                    mime_type: file.mimetype,
                    size_bytes: file.size,
                    created_by: userId,
                });
                // Start OCR in background
                runOcrInBackground(result.id, file, doc.id);
            }));
        }

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const body = { ...req.body };
        const userId = req.user?.id || null;
        
        // Handle supplementary file
        if (req.files && req.files.fichier_joint && req.files.fichier_joint.length > 0) {
            body.file_path = req.files.fichier_joint[0].filename;
        }
        
        const result = await courrierService.update(req.params.id, body);

        if (req.files && req.files.documents && req.files.documents.length > 0) {
            await Promise.all(req.files.documents.map(async (file) => {
                const doc = await courrierDocumentRepository.create({
                    courrier_id: req.params.id,
                    file_path: file.filename,
                    original_name: file.originalname,
                    mime_type: file.mimetype,
                    size_bytes: file.size,
                    created_by: userId,
                });
                // Start OCR in background
                runOcrInBackground(req.params.id, file, doc.id);
            }));
        }

        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const result = await courrierService.delete(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.readyToArchive = async (req, res, next) => {
    try {
        const rows = await courrierService.getReadyToArchive();
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.scan = async (req, res, next) => {
    try {
        const result = await scanService.createCourrierFromScan(req.files, req.body, req.user?.id);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.uploadScan = async (req, res, next) => {
    try {
        const filePath = await scanService.prepareScan(req.files);
        res.status(201).json({ file_path: filePath });
    } catch (err) {
        next(err);
    }
};

exports.ocr = async (req, res, next) => {
    try {
        const result = await scanService.runOcr(req.body.courrier_id || req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.viewPdf = async (req, res, next) => {
    try {
        const courrier = await courrierService.getById(req.params.id);
        const pdfPath = scanService.resolvePdfPath(courrier);
        if (!pdfPath) return res.status(404).json({ error: 'PDF introuvable' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.sendFile(pdfPath);
    } catch (err) {
        next(err);
    }
};

exports.downloadPdf = async (req, res, next) => {
    try {
        const courrier = await courrierService.getById(req.params.id);
        const pdfPath = scanService.resolvePdfPath(courrier);
        if (!pdfPath) return res.status(404).json({ error: 'PDF introuvable' });
        res.download(pdfPath, `${courrier.reference || 'courrier'}.pdf`);
    } catch (err) {
        next(err);
    }
};

exports.deletePdf = async (req, res, next) => {
    try {
        const result = await scanService.removePdf(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
