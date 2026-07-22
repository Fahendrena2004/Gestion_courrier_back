const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const CourrierService = require('./courrierService');
const OcrService = require('./ocrService');
const CourrierDocumentRepository = require('../repositories/courrierDocumentRepository');

const uploadRoot = path.join(__dirname, '../../uploads');
const scanRoot = path.join(uploadRoot, 'scans');

class ScanService {
  constructor() {
    this.courrierService = new CourrierService();
    this.ocrService = new OcrService();
    this.documentRepository = new CourrierDocumentRepository();
  }

  async prepareScan(files) {
    if (!files?.length) {
      const error = new Error('Aucun fichier fourni.');
      error.status = 400;
      throw error;
    }

    const pdfFile = files.find((file) => file.mimetype === 'application/pdf');
    if (pdfFile && files.length === 1) {
      return this.toRelativeUploadPath(pdfFile.path);
    }

    const images = files.filter((file) => file.mimetype.startsWith('image/'));
    if (images.length !== files.length) {
      const error = new Error('Import mixte non supporté. Envoyez un PDF seul ou des images uniquement.');
      error.status = 400;
      throw error;
    }

    return this.generatePdfFromImages(images);
  }

  async createCourrierFromScan(files, metadata, userId) {
    const relativePdfPath = await this.prepareScan(files);
    const absolutePdfPath = path.join(uploadRoot, relativePdfPath);
    let ocrText = '';
    let ocrMetadata = {};

    try {
      ocrText = await this.ocrService.extractText(absolutePdfPath);
      ocrMetadata = this.ocrService.parseMetadata(ocrText);
    } catch (error) {
      ocrMetadata = { warning: error.message };
    }

    const courrier = await this.courrierService.create({
      reference: metadata.reference || ocrMetadata.reference || this.generateReference(),
      type: metadata.type || 'arrive',
      subject: metadata.subject || ocrMetadata.subject || 'Courrier numérisé',
      content: metadata.content || ocrText || null,
      status: metadata.status || 'registered',
      priority: metadata.priority || 'normal',
      date_courrier: metadata.date_courrier || null,
      date_reception: metadata.date_reception || new Date().toISOString().slice(0, 10),
      sender_id: metadata.sender_id || null,
      recipient_id: metadata.recipient_id || null,
      service_id: metadata.service_id || null,
      assigned_to: metadata.assigned_to || null,
      created_by: userId || null,
      file_path: relativePdfPath.replace(/\\/g, '/'),
    });

    const stat = fs.statSync(absolutePdfPath);
    await this.documentRepository.create({
      courrier_id: courrier.id,
      file_path: relativePdfPath.replace(/\\/g, '/'),
      original_name: files.map((file) => file.originalname).join(', '),
      mime_type: 'application/pdf',
      size_bytes: stat.size,
      ocr_text: ocrText,
      ocr_metadata: ocrMetadata,
      created_by: userId || null,
    });

    return { ...courrier, file_path: relativePdfPath.replace(/\\/g, '/'), ocr_text: ocrText, ocr_metadata: ocrMetadata };
  }

  async runOcr(courrierId) {
    const document = await this.documentRepository.findByCourrierId(courrierId);
    if (!document) {
      const error = new Error('PDF introuvable pour ce courrier.');
      error.status = 404;
      throw error;
    }
    const absolutePath = path.join(uploadRoot, document.file_path);
    const text = await this.ocrService.extractText(absolutePath);
    const metadata = this.ocrService.parseMetadata(text);
    await this.documentRepository.updateOcr(document.id, text, metadata);
    await this.courrierService.update(courrierId, { content: text });
    return { text, metadata };
  }

  async removePdf(courrierId) {
    const document = await this.documentRepository.findByCourrierId(courrierId);
    if (document) await this.documentRepository.softDeleteByCourrierId(courrierId);
    await this.courrierService.update(courrierId, { file_path: null });
    return { affectedRows: 1 };
  }

  resolvePdfPath(courrier) {
    if (!courrier?.file_path) return null;
    const absolutePath = path.join(uploadRoot, courrier.file_path);
    if (!absolutePath.startsWith(uploadRoot) || !fs.existsSync(absolutePath)) return null;
    return absolutePath;
  }

  generateReference() {
    return `SCAN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }

  toRelativeUploadPath(filePath) {
    return path.relative(uploadRoot, filePath).replace(/\\/g, '/');
  }

  generatePdfFromImages(images) {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-scan.pdf`;
      const absolutePdfPath = path.join(scanRoot, filename);
      const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
      const stream = fs.createWriteStream(absolutePdfPath);

      stream.on('finish', () => resolve(this.toRelativeUploadPath(absolutePdfPath)));
      stream.on('error', reject);
      doc.on('error', reject);
      doc.pipe(stream);

      images.forEach((image) => {
        doc.addPage({ size: 'A4', margin: 0 });
        doc.image(image.path, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
      });

      doc.end();
    });
  }
}

module.exports = ScanService;
