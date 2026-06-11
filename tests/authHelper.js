const request = require('supertest');
const db = require('../src/db');

async function getAuthCookie(app) {
  const email = 'testuser@example.com';
  const username = 'testuser';
  const password = 'password123';

  // Clean up user if exists to ensure clean state or just try logging in
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      await request(app)
        .post('/api/auth/register')
        .send({ username, email, password });
    }
  } catch (err) {
    // Silently continue
  }

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return loginRes.headers['set-cookie'];
}

module.exports = { getAuthCookie };
