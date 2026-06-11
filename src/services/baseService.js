const db = require('../db');

/**
 * Generic CRUD service operating on a given table.
 * @param {string} table - Name of the database table.
 */
class BaseService {
  constructor(table) {
    this.table = table;
  }

  /**
   * Retrieve all rows, optionally with pagination.
   * @param {object} options - { limit, offset }
   */
  async getAll(options = {}) {
    let query = `SELECT * FROM ${this.table}`;
    const values = [];
    if (options.limit) {
      query += ` LIMIT ? OFFSET ?`;
      values.push(options.limit, options.offset || 0);
    }
    const [rows] = await db.query(query, values);
    return rows;
  }

  async getById(id) {
    const [rows] = await db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return rows[0];
  }

  async create(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    const [result] = await db.query(
      `INSERT INTO ${this.table} (${fields}) VALUES (${placeholders})`,
      values
    );
    return { id: result.insertId };
  }

  async update(id, data) {
    const assignments = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    const [result] = await db.query(
      `UPDATE ${this.table} SET ${assignments} WHERE id = ?`,
      values
    );
    return { affectedRows: result.affectedRows };
  }

  async delete(id) {
    const [result] = await db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    return { affectedRows: result.affectedRows };
  }
}

module.exports = BaseService;

