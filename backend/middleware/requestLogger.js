const morgan = require('morgan');
const { logger, logApi } = require('../utils/logger');

// Create a stream for morgan to write to winston
const stream = {
  write: (message) => {
    // Remove trailing newline added by morgan
    logger.info(message.trim());
  }
};

// Custom morgan format for detailed logging
const morganFormat = ':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms - :user-agent';

// Morgan middleware for automatic request logging
const morganMiddleware = morgan(morganFormat, { stream });

// Enhanced request logger middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip, headers } = req;
  const userAgent = headers['user-agent'] || 'Unknown';
  
  // Log incoming request
  logApi.request(method, url, ip, userAgent);
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override res.end to log response
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const advisorId = req.advisor?.id || req.advisor?._id;
    
    // Log response
    logApi.response(method, url, statusCode, duration, advisorId);
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  // Handle errors
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      const advisorId = req.advisor?.id || req.advisor?._id;
      const errorMessage = typeof data === 'object' ? data.message || 'Unknown error' : data;
      logApi.error(method, url, { message: errorMessage }, advisorId);
    }
    return originalSend.call(this, data);
  };
  
  next();
};

// Middleware to add request ID for tracking
const addRequestId = (req, res, next) => {
  req.requestId = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  const { method, url, ip, headers } = req;
  
  // Log suspicious patterns
  if (url.includes('..') || url.includes('<script>') || url.includes('SELECT')) {
    require('../utils/logger').logSecurity.suspiciousActivity(
      'Potential path traversal or injection attempt', 
      ip, 
      `URL: ${url}`
    );
  }
  
  // Log multiple failed attempts (this would need rate limiting implementation)
  if (url.includes('/auth/login') && method === 'POST') {
    // This could be enhanced with Redis for tracking failed attempts
    logger.debug(`Login attempt from IP: ${ip}`);
  }
  
  next();
};

module.exports = {
  morganMiddleware,
  requestLogger,
  addRequestId,
  securityLogger
};