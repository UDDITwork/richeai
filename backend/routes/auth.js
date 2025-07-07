const express = require('express');
const jwt = require('jsonwebtoken');
const Advisor = require('../models/Advisor');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new advisor
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if advisor already exists
    let advisor = await Advisor.findOne({ email });
    if (advisor) {
      return res.status(400).json({
        success: false,
        message: 'Advisor already exists with this email'
      });
    }

    // Create new advisor
    advisor = new Advisor({
      firstName,
      lastName,
      email,
      password
    });

    await advisor.save();

    // Generate token
    const token = generateToken(advisor._id);

    res.status(201).json({
      success: true,
      message: 'Advisor registered successfully',
      token,
      advisor: {
        id: advisor._id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        email: advisor.email,
        isEmailVerified: advisor.isEmailVerified,
        status: advisor.status,
        createdAt: advisor.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
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
});

// @route   POST /api/auth/login
// @desc    Login advisor
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find advisor by email and include password
    const advisor = await Advisor.findOne({ email }).select('+password');
    if (!advisor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordValid = await advisor.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (advisor.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(advisor._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      advisor: {
        id: advisor._id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        email: advisor.email,
        isEmailVerified: advisor.isEmailVerified,
        status: advisor.status,
        createdAt: advisor.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current advisor profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const advisor = await Advisor.findById(req.advisor.id);
    if (!advisor) {
      return res.status(404).json({
        success: false,
        message: 'Advisor not found'
      });
    }

    res.json({
      success: true,
      advisor: {
        id: advisor._id,
        firstName: advisor.firstName,
        lastName: advisor.lastName,
        email: advisor.email,
        isEmailVerified: advisor.isEmailVerified,
        status: advisor.status,
        createdAt: advisor.createdAt,
        updatedAt: advisor.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout advisor (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;