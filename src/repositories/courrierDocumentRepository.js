const db = require('../db');

class CourrierDocumentRepository {
  async create(data) {
    const [result] = await db.query(
      `INSERT INTO courrier_documents
        (courrier_id, file_path, original_name, mime_type, size_bytes, ocr_text, ocr_metadata, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.courrier_id,
        data.file_path,
        data.original_name,
        data.mime_type,
        data.size_bytes,
        data.ocr_text || null,
        data.ocr_metadata ? JSON.stringify(data.ocr_metadata) : null,
        data.created_by || null,
      ]
    );
    return { id: result.insertId };
  }

  async findByCourrierId(courrierId) {
    const [rows] = await db.query(
      `SELECT * FROM courrier_documents
       WHERE courrier_id = ? AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT 1`,
      [courrierId]
    );
    return rows[0] || null;
  }

  async updateOcr(documentId, ocrText, ocrMetadata) {
    const [result] = await db.query(
      `UPDATE courrier_documents
       SET ocr_text = ?, ocr_metadata = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND deleted_at IS NULL`,
      [ocrText || null, ocrMetadata ? JSON.stringify(ocrMetadata) : null, documentId]
    );
    return { affectedRows: result.affectedRows };
  }

  async softDeleteByCourrierId(courrierId) {
    const [result] = await db.query(
      `UPDATE courrier_documents
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE courrier_id = ? AND deleted_at IS NULL`,
      [courrierId]
    );
    return { affectedRows: result.affectedRows };
  }
}

module.exports = CourrierDocumentRepository;
