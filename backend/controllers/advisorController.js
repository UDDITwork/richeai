const jwt = require('jsonwebtoken');
const Advisor = require('../models/Advisor');
const { logger, logAuth, logDatabase } = require('../utils/logger');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new advisor
// @route   POST /api/auth/register
// @access  Public
const registerAdvisor = async (req, res) => {
  const startTime = Date.now();
  const { firstName, lastName, email, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    logger.info(`Registration attempt for email: ${email} from IP: ${clientIp}`);
    
    // Check if advisor already exists
    const existingAdvisor = await Advisor.findOne({ email });
    if (existingAdvisor) {
      logAuth.loginFailed(email, 'Email already exists', clientIp);
      return res.status(400).json({
        success: false,
        message: 'Advisor already exists with this email'
      });
    }

    // Create new advisor
    const advisor = new Advisor({
      firstName,
      lastName,
      email,
      password
    });

    const savedAdvisor = await advisor.save();
    const duration = Date.now() - startTime;
    
    // Log successful registration
    logAuth.registration(email, savedAdvisor._id);
    logDatabase.queryExecution('Advisor', 'create', duration);

    // Generate token
    const token = generateToken(savedAdvisor._id);

    // Prepare response data (exclude password)
    const advisorData = {
      id: savedAdvisor._id,
      firstName: savedAdvisor.firstName,
      lastName: savedAdvisor.lastName,
      email: savedAdvisor.email,
      firmName: savedAdvisor.firmName,
      phoneNumber: savedAdvisor.phoneNumber,
      sebiRegNumber: savedAdvisor.sebiRegNumber,
      revenueModel: savedAdvisor.revenueModel,
      fpsbNumber: savedAdvisor.fpsbNumber,
      riaNumber: savedAdvisor.riaNumber,
      arnNumber: savedAdvisor.arnNumber,
      amfiRegNumber: savedAdvisor.amfiRegNumber,
      isEmailVerified: savedAdvisor.isEmailVerified,
      status: savedAdvisor.status,
      createdAt: savedAdvisor.createdAt
    };

    logger.info(`Registration successful for advisor: ${savedAdvisor._id} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Advisor registered successfully',
      token,
      advisor: advisorData
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Registration error for email: ${email} - ${error.message}`);
    logDatabase.operationError('Advisor.create', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login advisor
// @route   POST /api/auth/login
// @access  Public
const loginAdvisor = async (req, res) => {
  const startTime = Date.now();
  const { email, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    // Log login attempt
    logAuth.loginAttempt(email, clientIp);

    // Check if email and password are provided
    if (!email || !password) {
      logAuth.loginFailed(email || 'unknown', 'Missing credentials', clientIp);
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find advisor by email and include password
    const advisor = await Advisor.findOne({ email }).select('+password');
    if (!advisor) {
      logAuth.loginFailed(email, 'User not found', clientIp);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordValid = await advisor.comparePassword(password);
    if (!isPasswordValid) {
      logAuth.loginFailed(email, 'Invalid password', clientIp);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (advisor.status !== 'active') {
      logAuth.loginFailed(email, `Account status: ${advisor.status}`, clientIp);
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(advisor._id);
    const duration = Date.now() - startTime;

    // Log successful login
    logAuth.loginSuccess(email, advisor._id, clientIp);
    logDatabase.queryExecution('Advisor', 'findOne', duration);

    // Prepare response data (exclude password)
    const advisorData = {
      id: advisor._id,
      firstName: advisor.firstName,
      lastName: advisor.lastName,
      email: advisor.email,
      firmName: advisor.firmName,
      phoneNumber: advisor.phoneNumber,
      sebiRegNumber: advisor.sebiRegNumber,
      revenueModel: advisor.revenueModel,
      fpsbNumber: advisor.fpsbNumber,
      riaNumber: advisor.riaNumber,
      arnNumber: advisor.arnNumber,
      amfiRegNumber: advisor.amfiRegNumber,
      isEmailVerified: advisor.isEmailVerified,
      status: advisor.status,
      createdAt: advisor.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      advisor: advisorData
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Login error for email: ${email} - ${error.message}`);
    logDatabase.operationError('Advisor.findOne', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current advisor profile
// @route   GET /api/auth/profile
// @access  Private
const getAdvisorProfile = async (req, res) => {
  const startTime = Date.now();
  const advisorId = req.advisor.id;
  
  try {
    logger.info(`Profile fetch request for advisor: ${advisorId}`);
    
    const advisor = await Advisor.findById(advisorId);
    if (!advisor) {
      logger.warn(`Profile fetch failed - advisor not found: ${advisorId}`);
      return res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
    }

    const duration = Date.now() - startTime;
    logDatabase.queryExecution('Advisor', 'findById', duration);

    // Prepare response data
    const advisorData = {
      id: advisor._id,
      firstName: advisor.firstName,
      lastName: advisor.lastName,
      email: advisor.email,
      firmName: advisor.firmName,
      phoneNumber: advisor.phoneNumber,
      sebiRegNumber: advisor.sebiRegNumber,
      revenueModel: advisor.revenueModel,
      fpsbNumber: advisor.fpsbNumber,
      riaNumber: advisor.riaNumber,
      arnNumber: advisor.arnNumber,
      amfiRegNumber: advisor.amfiRegNumber,
      isEmailVerified: advisor.isEmailVerified,
      status: advisor.status,
      createdAt: advisor.createdAt,
      updatedAt: advisor.updatedAt
    };

    logger.info(`Profile fetch successful for advisor: ${advisorId}`);

    res.json({
      success: true,
      advisor: advisorData
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Profile fetch error for advisor: ${advisorId} - ${error.message}`);
    logDatabase.operationError('Advisor.findById', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update advisor profile
// @route   PUT /api/auth/profile
// @access  Private
const updateAdvisorProfile = async (req, res) => {
  const startTime = Date.now();
  const advisorId = req.advisor.id;
  const updateData = req.body;
  
  try {
    logger.info(`Profile update request for advisor: ${advisorId}`);
    
    const {
      firstName,
      lastName,
      firmName,
      phoneNumber,
      sebiRegNumber,
      revenueModel,
      fpsbNumber,
      riaNumber,
      arnNumber,
      amfiRegNumber
    } = updateData;

    // Find advisor
    const advisor = await Advisor.findById(advisorId);
    if (!advisor) {
      logger.warn(`Profile update failed - advisor not found: ${advisorId}`);
      return res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
    }

    // Track what fields are being updated
    const updatedFields = [];
    const originalData = advisor.toObject();

    // Update fields and track changes
    if (firstName !== undefined && firstName !== advisor.firstName) {
      advisor.firstName = firstName;
      updatedFields.push('firstName');
    }
    if (lastName !== undefined && lastName !== advisor.lastName) {
      advisor.lastName = lastName;
      updatedFields.push('lastName');
    }
    if (firmName !== undefined && firmName !== advisor.firmName) {
      advisor.firmName = firmName;
      updatedFields.push('firmName');
    }
    if (phoneNumber !== undefined && phoneNumber !== advisor.phoneNumber) {
      advisor.phoneNumber = phoneNumber;
      updatedFields.push('phoneNumber');
    }
    if (sebiRegNumber !== undefined && sebiRegNumber !== advisor.sebiRegNumber) {
      advisor.sebiRegNumber = sebiRegNumber;
      updatedFields.push('sebiRegNumber');
    }
    if (revenueModel !== undefined && revenueModel !== advisor.revenueModel) {
      advisor.revenueModel = revenueModel;
      updatedFields.push('revenueModel');
    }
    if (fpsbNumber !== undefined && fpsbNumber !== advisor.fpsbNumber) {
      advisor.fpsbNumber = fpsbNumber;
      updatedFields.push('fpsbNumber');
    }
    if (riaNumber !== undefined && riaNumber !== advisor.riaNumber) {
      advisor.riaNumber = riaNumber;
      updatedFields.push('riaNumber');
    }
    if (arnNumber !== undefined && arnNumber !== advisor.arnNumber) {
      advisor.arnNumber = arnNumber;
      updatedFields.push('arnNumber');
    }
    if (amfiRegNumber !== undefined && amfiRegNumber !== advisor.amfiRegNumber) {
      advisor.amfiRegNumber = amfiRegNumber;
      updatedFields.push('amfiRegNumber');
    }

    // Save if there are changes
    if (updatedFields.length > 0) {
      await advisor.save();
      const duration = Date.now() - startTime;
      
      // Log the profile update
      logAuth.profileUpdate(advisorId, updatedFields);
      logDatabase.queryExecution('Advisor', 'save', duration);
      
      logger.info(`Profile updated successfully for advisor: ${advisorId} - Updated fields: ${updatedFields.join(', ')}`);
    } else {
      logger.info(`No changes detected in profile update for advisor: ${advisorId}`);
    }

    // Prepare response data
    const advisorData = {
      id: advisor._id,
      firstName: advisor.firstName,
      lastName: advisor.lastName,
      email: advisor.email,
      firmName: advisor.firmName,
      phoneNumber: advisor.phoneNumber,
      sebiRegNumber: advisor.sebiRegNumber,
      revenueModel: advisor.revenueModel,
      fpsbNumber: advisor.fpsbNumber,
      riaNumber: advisor.riaNumber,
      arnNumber: advisor.arnNumber,
      amfiRegNumber: advisor.amfiRegNumber,
      isEmailVerified: advisor.isEmailVerified,
      status: advisor.status,
      updatedAt: advisor.updatedAt
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      advisor: advisorData
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Profile update error for advisor: ${advisorId} - ${error.message}`);
    logDatabase.operationError('Advisor.save', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Logout advisor
// @route   POST /api/auth/logout
// @access  Private
const logoutAdvisor = (req, res) => {
  const advisorId = req.advisor?.id;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  // Log the logout
  logAuth.logout(advisorId, clientIp);
  logger.info(`Advisor logout: ${advisorId} from IP: ${clientIp}`);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

module.exports = {
  registerAdvisor,
  loginAdvisor,
  getAdvisorProfile,
  updateAdvisorProfile,
  logoutAdvisor
};