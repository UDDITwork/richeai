const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'richieat-backend' },
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Production logging adjustments
if (process.env.NODE_ENV === 'production') {
  logger.transports.forEach((transport) => {
    if (transport instanceof winston.transports.Console) {
      transport.silent = true;
    }
  });
}

// Helper functions for common logging patterns
const logAuth = {
  loginAttempt: (email, ip) => {
    logger.info(`Login attempt for email: ${email} from IP: ${ip}`);
  },
  loginSuccess: (email, advisorId, ip) => {
    logger.info(`Successful login for advisor: ${advisorId} (${email}) from IP: ${ip}`);
  },
  loginFailed: (email, reason, ip) => {
    logger.warn(`Failed login attempt for email: ${email} - Reason: ${reason} from IP: ${ip}`);
  },
  logout: (advisorId, ip) => {
    logger.info(`Advisor logout: ${advisorId} from IP: ${ip}`);
  },
  tokenValidation: (advisorId, status) => {
    logger.debug(`Token validation for advisor: ${advisorId} - Status: ${status}`);
  },
  registration: (email, advisorId) => {
    logger.info(`New advisor registration: ${advisorId} (${email})`);
  },
  profileUpdate: (advisorId, updatedFields) => {
    logger.info(`Profile updated for advisor: ${advisorId} - Fields: ${updatedFields.join(', ')}`);
  }
};

const logDatabase = {
  connectionAttempt: () => {
    logger.info('Attempting to connect to MongoDB...');
  },
  connectionSuccess: () => {
    logger.info('Successfully connected to MongoDB');
  },
  connectionError: (error) => {
    logger.error(`MongoDB connection error: ${error.message}`);
  },
  operationError: (operation, error) => {
    logger.error(`Database operation failed - ${operation}: ${error.message}`);
  },
  queryExecution: (model, operation, duration) => {
    logger.debug(`DB Query: ${model}.${operation} completed in ${duration}ms`);
  }
};

const logApi = {
  request: (method, url, ip, userAgent) => {
    logger.info(`${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
  },
  response: (method, url, statusCode, duration, advisorId) => {
    const advisor = advisorId ? ` - Advisor: ${advisorId}` : '';
    logger.info(`${method} ${url} - ${statusCode} - ${duration}ms${advisor}`);
  },
  error: (method, url, error, advisorId) => {
    const advisor = advisorId ? ` - Advisor: ${advisorId}` : '';
    logger.error(`${method} ${url} - Error: ${error.message}${advisor}`);
  }
};

const logSecurity = {
  suspiciousActivity: (activity, ip, details) => {
    logger.warn(`Suspicious activity detected: ${activity} from IP: ${ip} - Details: ${details}`);
  },
  authorizationFailure: (advisorId, resource, action) => {
    logger.warn(`Authorization failed - Advisor: ${advisorId} attempted ${action} on ${resource}`);
  },
  rateLimitExceeded: (ip, endpoint) => {
    logger.warn(`Rate limit exceeded for IP: ${ip} on endpoint: ${endpoint}`);
  }
};

module.exports = {
  logger,
  logAuth,
  logDatabase,
  logApi,
  logSecurity
};