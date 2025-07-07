const jwt = require('jsonwebtoken');
const Advisor = require('../models/Advisor');
const { logger, logAuth, logSecurity } = require('../utils/logger');

const auth = async (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  const { method, url } = req;
  
  try {
    // Get token from header
    const token = req.header('Authorization');
    
    if (!token) {
      logger.warn(`Authorization failed - No token provided for ${method} ${url} from IP: ${clientIp}`);
      logSecurity.authorizationFailure('unknown', url, method);
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Check if token starts with 'Bearer '
    let actualToken = token;
    if (token.startsWith('Bearer ')) {
      actualToken = token.slice(7);
    }

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    logger.debug(`Token verification successful for advisor: ${decoded.id}`);
    
    // Find advisor by ID
    const advisor = await Advisor.findById(decoded.id);
    if (!advisor) {
      logger.warn(`Authorization failed - Advisor not found: ${decoded.id} for ${method} ${url} from IP: ${clientIp}`);
      logSecurity.authorizationFailure(decoded.id, url, method);
      return res.status(401).json({
        success: false,
        message: 'Token is not valid - advisor not found'
      });
    }

    // Check if account is active
    if (advisor.status !== 'active') {
      logger.warn(`Authorization failed - Account inactive: ${advisor._id} (status: ${advisor.status}) for ${method} ${url} from IP: ${clientIp}`);
      logSecurity.authorizationFailure(advisor._id, url, method);
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Log successful authentication
    logAuth.tokenValidation(advisor._id, 'success');
    logger.debug(`Authentication successful for advisor: ${advisor._id} accessing ${method} ${url}`);

    // Add advisor to request object
    req.advisor = advisor;
    next();
  } catch (error) {
    logger.error(`Auth middleware error for ${method} ${url} from IP: ${clientIp} - ${error.message}`);
    
    if (error.name === 'JsonWebTokenError') {
      logSecurity.authorizationFailure('unknown', url, 'Invalid token');
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      logSecurity.authorizationFailure('unknown', url, 'Token expired');
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = auth;