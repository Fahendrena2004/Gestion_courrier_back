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
        u.username AS assigned_username
      FROM courriers c 
      LEFT JOIN contacts sender ON c.sender_id = sender.id 
      LEFT JOIN contacts recipient ON c.recipient_id = recipient.id
      LEFT JOIN services s ON c.service_id = s.id
      LEFT JOIN users u ON c.assigned_to = u.id
      WHERE c.deleted_at IS NULL
    `;
    
    // Add filters logic here later if needed
    
    query += ` ORDER BY c.created_at DESC`;
    
    const [rows] = await db.query(query);
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
    return rows[0];
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
}

module.exports = CourrierService;
