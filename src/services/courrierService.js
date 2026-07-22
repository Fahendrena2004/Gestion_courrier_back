const db = require('../db');
const BaseService = require('./baseService');

class CourrierService extends BaseService {
  constructor() {
    super('courriers');
  }

  async getAll(options = {}) {
    let query = `
      SELECT c.*, 
        sender.name AS sender_name, 
        recipient.name AS recipient_name,
        s.name AS service_name,
        u.username AS assigned_username,
        (SELECT ocr_text FROM courrier_documents cd WHERE cd.courrier_id = c.id AND cd.deleted_at IS NULL LIMIT 1) as ocr_text
      FROM courriers c 
      LEFT JOIN contacts sender ON c.sender_id = sender.id 
      LEFT JOIN contacts recipient ON c.recipient_id = recipient.id
      LEFT JOIN services s ON c.service_id = s.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.deleted_at IS NULL
    `;
    
    const values = [];
    if (options.search) {
      query += `
        AND (
          c.reference LIKE ?
          OR c.subject LIKE ?
          OR c.content LIKE ?
          OR sender.name LIKE ?
          OR recipient.name LIKE ?
          OR EXISTS (SELECT 1 FROM courrier_documents cd WHERE cd.courrier_id = c.id AND cd.deleted_at IS NULL AND cd.ocr_text LIKE ?)
        )
      `;
      const term = `%${options.search}%`;
      values.push(term, term, term, term, term, term);
    }

    if (options.date) {
      query += ` AND (c.date_courrier = ? OR c.date_reception = ?)`;
      values.push(options.date, options.date);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const [rows] = await db.query(query, values);
    return rows;
  }

  async getById(id) {
    const query = `
      SELECT c.*, 
        sender.name AS sender_name, 
        recipient.name AS recipient_name,
        s.name AS service_name,
        u.username AS assigned_username
      FROM courriers c 
      LEFT JOIN contacts sender ON c.sender_id = sender.id 
      LEFT JOIN contacts recipient ON c.recipient_id = recipient.id
      LEFT JOIN services s ON c.service_id = s.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.id = ? AND c.deleted_at IS NULL
    `;
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) return null;
    
    const courrier = rows[0];
    
    // Fetch all documents for this courrier
    const docQuery = `
      SELECT id, file_path, original_name, mime_type, size_bytes, ocr_text, ocr_metadata
      FROM courrier_documents
      WHERE courrier_id = ? AND deleted_at IS NULL
      ORDER BY created_at ASC
    `;
    const [docs] = await db.query(docQuery, [id]);
    
    courrier.documents = docs;
    
    return courrier;
  }

  async create(data) {
    const allowedFields = [
      'reference', 'type', 'subject', 'sender_id', 'recipient_id', 
      'content', 'file_path', 'status', 'priority', 
      'date_courrier', 'date_reception', 'service_id', 'assigned_to', 'created_by'
    ];

    const fields = [];
    const values = [];
    const placeholders = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(field);
        values.push(data[field] === '' || data[field] === 'null' ? null : data[field]);
        placeholders.push('?');
      }
    });

    const query = `INSERT INTO courriers (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId };
  }

  async update(id, data) {
    const allowedFields = [
      'reference', 'type', 'subject', 'sender_id', 'recipient_id', 
      'content', 'file_path', 'status', 'priority', 
      'date_courrier', 'date_reception', 'service_id', 'assigned_to'
    ];

    const fields = [];
    const values = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field] === '' || data[field] === 'null' ? null : data[field]);
      }
    });

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(id);
    const [result] = await db.query(`UPDATE courriers SET ${fields.join(', ')} WHERE id = ?`, values);
    return { affectedRows: result.affectedRows };
  }

  // Soft delete override
  async delete(id) {
    const [result] = await db.query(`UPDATE courriers SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
    return { affectedRows: result.affectedRows };
  }

  /**
   * Fetch courriers that are eligible for archiving:
   * - Not already archived (status != 'archived')
   * - Not deleted
   * - All associated tasks are completed ('done'), or no tasks exist
   */
  async getReadyToArchive() {
    const query = `
      SELECT c.id, c.reference, c.subject, c.type, c.file_path, c.status, c.date_courrier, c.date_reception
      FROM courriers c
      WHERE c.deleted_at IS NULL
        AND c.status != 'archived'
        AND (
          -- Either all tasks for this courrier are done
          NOT EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.courrier_id = c.id
              AND t.deleted_at IS NULL
              AND t.status != 'done'
          )
          -- And at least one task exists (courrier has been worked on)
          AND EXISTS (
            SELECT 1 FROM tasks t
            WHERE t.courrier_id = c.id
              AND t.deleted_at IS NULL
          )
        )
      ORDER BY c.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = CourrierService;
