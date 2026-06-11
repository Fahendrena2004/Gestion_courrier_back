require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5003,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestion_courrier',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
