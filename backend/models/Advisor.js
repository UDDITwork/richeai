const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { logger, logDatabase } = require('../utils/logger');

const advisorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  firmName: {
    type: String,
    trim: true,
    maxlength: [100, 'Firm name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Please enter a valid phone number']
  },
  sebiRegNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  revenueModel: {
    type: String,
    enum: ['Fee-Only', 'Commission-Based', 'Fee + Commission', ''],
    default: ''
  },
  fpsbNumber: {
    type: String,
    trim: true
  },
  riaNumber: {
    type: String,
    trim: true
  },
  arnNumber: {
    type: String,
    trim: true,
    uppercase: true
  },
  amfiRegNumber: {
    type: String,
    trim: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
advisorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
advisorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile data
advisorSchema.methods.toJSON = function() {
  const advisor = this.toObject();
  delete advisor.password;
  return advisor;
};

// Mongoose middleware for logging database operations
advisorSchema.pre('save', function(next) {
  const startTime = Date.now();
  
  // Log the operation
  const isNew = this.isNew;
  const operation = isNew ? 'create' : 'update';
  const advisorId = this._id || 'new';
  
  logger.debug(`DB Operation started: Advisor.${operation} for ID: ${advisorId}`);
  
  // Store start time for post middleware
  this._startTime = startTime;
  
  next();
});

advisorSchema.post('save', function(doc, next) {
  const duration = Date.now() - this._startTime;
  const operation = doc.isNew ? 'create' : 'update';
  
  logDatabase.queryExecution('Advisor', operation, duration);
  logger.info(`DB Operation completed: Advisor.${operation} for ID: ${doc._id} in ${duration}ms`);
  
  next();
});

advisorSchema.post('save', function(error, doc, next) {
  if (error) {
    logDatabase.operationError('Advisor.save', error);
    logger.error(`DB Operation failed: Advisor.save for ID: ${doc?._id || 'unknown'} - ${error.message}`);
  }
  next(error);
});

// Log find operations
advisorSchema.pre(/^find/, function() {
  this._startTime = Date.now();
  logger.debug(`DB Operation started: Advisor.${this.getOptions().op || 'find'}`);
});

advisorSchema.post(/^find/, function(result) {
  const duration = Date.now() - this._startTime;
  const operation = this.getOptions().op || 'find';
  const resultCount = Array.isArray(result) ? result.length : (result ? 1 : 0);
  
  logDatabase.queryExecution('Advisor', operation, duration);
  logger.debug(`DB Operation completed: Advisor.${operation} returned ${resultCount} document(s) in ${duration}ms`);
});

advisorSchema.post(/^find/, function(error, result, next) {
  if (error) {
    const operation = this.getOptions().op || 'find';
    logDatabase.operationError(`Advisor.${operation}`, error);
    logger.error(`DB Operation failed: Advisor.${operation} - ${error.message}`);
  }
  if (next) next(error);
});

// Log remove operations
advisorSchema.pre('remove', function() {
  this._startTime = Date.now();
  logger.debug(`DB Operation started: Advisor.remove for ID: ${this._id}`);
});

advisorSchema.post('remove', function(doc) {
  const duration = Date.now() - this._startTime;
  logDatabase.queryExecution('Advisor', 'remove', duration);
  logger.info(`DB Operation completed: Advisor.remove for ID: ${doc._id} in ${duration}ms`);
});

module.exports = mongoose.model('Advisor', advisorSchema);