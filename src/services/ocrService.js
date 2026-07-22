class OcrService {
  async extractText(filePath) {
    let createWorker;
    try {
      ({ createWorker } = require('tesseract.js'));
    } catch (error) {
      const err = new Error('OCR indisponible. Installez la dépendance tesseract.js.');
      err.status = 503;
      throw err;
    }

    const worker = await createWorker('fra+eng');
    try {
      const result = await worker.recognize(filePath);
      return result.data.text || '';
    } finally {
      await worker.terminate();
    }
  }

  parseMetadata(text) {
    const normalized = (text || '').replace(/\r/g, '\n');
    const find = (patterns) => {
      for (const pattern of patterns) {
        const match = normalized.match(pattern);
        if (match?.[1]) return match[1].trim().replace(/\s+/g, ' ');
      }
      return '';
    };

    return {
      reference: find([/(?:réf(?:érence)?|ref|n[°o])\s*[:\-]\s*([A-Z0-9/_\-]+)/i]),
      sender: find([/(?:expéditeur|de|from)\s*[:\-]\s*(.+)/i]),
      recipient: find([/(?:destinataire|à|to)\s*[:\-]\s*(.+)/i]),
      subject: find([/(?:objet|subject)\s*[:\-]\s*(.+)/i]),
      date: find([/(?:date)\s*[:\-]\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i]),
      fullText: normalized.trim(),
    };
  }
}

module.exports = OcrService;
