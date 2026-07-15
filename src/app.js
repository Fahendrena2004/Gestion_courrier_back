const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./auth');
const userRoutes = require('./routes/users');
const courrierRoutes = require('./routes/courriers');
const archiveRoutes = require('./routes/archives');
const contactRoutes = require('./routes/contacts');
const serviceRoutes = require('./routes/services');
const taskRoutes = require('./routes/tasks');

// Load environment variables
dotenv.config();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion Courrier API',
      version: '1.0.0',
      description: 'API documentation for Gestion Courrier backend',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5003}` }],
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Apply rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Gestion Courrier API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courriers', courrierRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
