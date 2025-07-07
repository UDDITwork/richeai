require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { logger, logDatabase } = require('./utils/logger');
const { morganMiddleware, requestLogger, addRequestId, securityLogger } = require('./middleware/requestLogger');

const app = express();

// Environment and startup logging
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

logger.info('='.repeat(50));
logger.info('RICHIEAT Backend Server Starting...');
logger.info(`Environment: ${NODE_ENV}`);
logger.info(`Port: ${PORT}`);
logger.info('='.repeat(50));

// Trust proxy for proper IP logging
app.set('trust proxy', 1);

// Request logging middleware (must be first)
app.use(addRequestId);
app.use(morganMiddleware);
app.use(requestLogger);
app.use(securityLogger);

// Basic middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json({ 
  limit: '10mb',
  strict: true
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// MongoDB connection with retry logic
const connectWithRetry = () => {
  logDatabase.connectionAttempt();
  
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true
  })
  .then(() => {
    logDatabase.connectionSuccess();
    logger.info('✅ MongoDB connected successfully');
  })
  .catch(err => {
    logDatabase.connectionError(err);
    logger.error('❌ MongoDB connection failed. Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

// MongoDB connection event listeners
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected successfully');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});

// Start connection
connectWithRetry();

// Health check route
app.get('/', (req, res) => {
  const healthStatus = {
    message: 'RICHIEAT Backend API is running!',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  };
  
  logger.debug('Health check requested');
  res.json(healthStatus);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Global error handling middleware
app.use((err, req, res, next) => {
  const { method, url } = req;
  const advisorId = req.advisor?.id;
  
  logger.error(`Unhandled error in ${method} ${url}${advisorId ? ` (Advisor: ${advisorId})` : ''}: ${err.message}`);
  logger.error(err.stack);
  
  // Don't leak error details in production
  const message = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
    
  res.status(err.status || 500).json({
    success: false,
    message: 'Something went wrong!',
    error: message,
    requestId: req.requestId
  });
});

// 404 handler
app.use((req, res) => {
  const { method, url, ip } = req;
  
  logger.warn(`404 - Route not found: ${method} ${url} from IP: ${ip}`);
  
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestId: req.requestId
  });
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    logger.info('Server shutdown complete');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${NODE_ENV}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
  logger.info('Server startup complete ✅');
});