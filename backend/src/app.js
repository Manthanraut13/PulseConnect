const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const donorRoutes = require('./routes/donors');
const bloodBankRoutes = require('./routes/bloodBanks');
const requestRoutes = require('./routes/requests');
const ngoRoutes = require('./routes/ngos');
const transportRoutes = require('./routes/transport');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Middleware
const errorHandler = require('./middleware/error');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/blood-banks', bloodBankRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/ngos', ngoRoutes);
app.use('/api/v1/transport', transportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;