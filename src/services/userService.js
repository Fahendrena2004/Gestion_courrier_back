const db = require('../db');
const bcrypt = require('bcryptjs');
const BaseService = require('./baseService');

class UserService extends BaseService {
  constructor() {
    super('users');
  }

  async getAll(options = {}) {
    const query = `
      SELECT u.id, u.username, u.email, u.role, u.service_id, u.is_active, u.created_at, s.name AS service_name
      FROM users u
      LEFT JOIN services s ON u.service_id = s.id
      WHERE u.deleted_at IS NULL
    `;
    const [rows] = await db.query(query);
    return rows;
  }

  async getById(id) {
    const query = `
      SELECT u.id, u.username, u.email, u.role, u.service_id, u.is_active, u.created_at, s.name AS service_name
      FROM users u
      LEFT JOIN services s ON u.service_id = s.id
      WHERE u.id = ? AND u.deleted_at IS NULL
    `;
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) return null;
    return rows[0];
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password || '12345678', 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role, service_id) VALUES (?, ?, ?, ?, ?)',
      [data.username, data.email, hash, data.role || 'agent', data.service_id || null]
    );
    return { id: result.insertId };
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    const allowedFields = ['username', 'email', 'role', 'service_id', 'is_active'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });

    if (data.password && data.password.trim() !== '') {
      const hash = await bcrypt.hash(data.password, 10);
      fields.push('password = ?');
      values.push(hash);
    }

    if (fields.length === 0) return { affectedRows: 0 };

    values.push(id);
    const [result] = await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return { affectedRows: result.affectedRows };
  }
}

module.exports = UserService;
