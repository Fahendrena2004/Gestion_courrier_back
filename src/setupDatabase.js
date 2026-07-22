require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    const schemaPath = path.resolve(__dirname, '..', 'db', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSQL);
    console.log('✅ Database schema created / updated successfully.');
    await pool.end();
  } catch (err) {
    console.error('❌ Error setting up database:', err);
    process.exit(1);
  }
})();
