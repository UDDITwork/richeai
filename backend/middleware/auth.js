const jwt = require('jsonwebtoken');
const Advisor = require('../models/Advisor');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');
    
    if (!token) {
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
    
    // Find advisor by ID
    const advisor = await Advisor.findById(decoded.id);
    if (!advisor) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid - advisor not found'
      });
    }

    // Check if account is active
    if (advisor.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Add advisor to request object
    req.advisor = advisor;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
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