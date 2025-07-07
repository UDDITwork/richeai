const mongoose = require('mongoose');
const { logger, logDatabase } = require('../utils/logger');

const clientSchema = new mongoose.Schema({
  // Personal Information
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
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Please enter a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [10, 'Zip code cannot exceed 10 characters']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, 'Country cannot exceed 50 characters'],
      default: 'India'
    }
  },

  // Financial Information
  annualIncome: {
    type: Number,
    min: [0, 'Annual income cannot be negative']
  },
  netWorth: {
    type: Number,
    min: [0, 'Net worth cannot be negative']
  },
  monthlySavingsTarget: {
    type: Number,
    min: [0, 'Monthly savings target cannot be negative']
  },
  investmentExperience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', ''],
    default: ''
  },
  riskTolerance: {
    type: String,
    enum: ['Conservative', 'Moderate', 'Aggressive', 'Very Aggressive', ''],
    default: ''
  },
  
  // Investment Goals
  investmentGoals: [{
    type: String,
    enum: ['Retirement', 'Education', 'Home Purchase', 'Emergency Fund', 'Wealth Building', 'Tax Saving', 'Other']
  }],
  investmentHorizon: {
    type: String,
    enum: ['Short-term (1-3 years)', 'Medium-term (3-7 years)', 'Long-term (7+ years)', ''],
    default: ''
  },
  
  // KYC Information
  panNumber: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  aadharNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{12}$/, 'Please enter a valid Aadhar number']
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  kycDocuments: [{
    type: {
      type: String,
      enum: ['PAN', 'Aadhar', 'Address Proof', 'Bank Statement', 'Other']
    },
    fileName: String,
    filePath: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],

  // Account Information
  bankDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
    },
    bankName: {
      type: String,
      trim: true,
      maxlength: [100, 'Bank name cannot exceed 100 characters']
    },
    branchName: {
      type: String,
      trim: true,
      maxlength: [100, 'Branch name cannot exceed 100 characters']
    }
  },

  // Advisor Relationship
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor',
    required: [true, 'Advisor reference is required']
  },

  // Status and Tracking
  status: {
    type: String,
    enum: ['invited', 'onboarding', 'active', 'inactive', 'suspended'],
    default: 'invited'
  },
  onboardingStep: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  
  // Communication Preferences
  communicationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    phone: {
      type: Boolean,
      default: true
    },
    whatsapp: {
      type: Boolean,
      default: false
    }
  },

  // Additional Notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Compliance
  fatcaStatus: {
    type: String,
    enum: ['pending', 'completed', 'not_applicable'],
    default: 'pending'
  },
  crsStatus: {
    type: String,
    enum: ['pending', 'completed', 'not_applicable'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for better performance
clientSchema.index({ advisor: 1, status: 1 });
clientSchema.index({ email: 1 });
clientSchema.index({ 'advisor': 1, 'firstName': 1, 'lastName': 1 });

// Virtual for full name
clientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

// Remove sensitive information from JSON output
clientSchema.methods.toJSON = function() {
  const client = this.toObject();
  
  // Remove sensitive fields
  if (client.aadharNumber) {
    client.aadharNumber = client.aadharNumber.replace(/\d(?=\d{4})/g, '*');
  }
  if (client.bankDetails && client.bankDetails.accountNumber) {
    client.bankDetails.accountNumber = client.bankDetails.accountNumber.replace(/\d(?=\d{4})/g, '*');
  }
  
  return client;
};

// Mongoose middleware for logging database operations
clientSchema.pre('save', function(next) {
  const startTime = Date.now();
  
  // Log the operation
  const isNew = this.isNew;
  const operation = isNew ? 'create' : 'update';
  const clientId = this._id || 'new';
  
  logger.debug(`DB Operation started: Client.${operation} for ID: ${clientId}`);
  
  // Store start time for post middleware
  this._startTime = startTime;
  
  next();
});

clientSchema.post('save', function(doc, next) {
  const duration = Date.now() - this._startTime;
  const operation = doc.isNew ? 'create' : 'update';
  
  logDatabase.queryExecution('Client', operation, duration);
  logger.info(`DB Operation completed: Client.${operation} for ID: ${doc._id} in ${duration}ms`);
  
  next();
});

clientSchema.post('save', function(error, doc, next) {
  if (error) {
    logDatabase.operationError('Client.save', error);
    logger.error(`DB Operation failed: Client.save for ID: ${doc?._id || 'unknown'} - ${error.message}`);
  }
  next(error);
});

// Log find operations
clientSchema.pre(/^find/, function() {
  this._startTime = Date.now();
  logger.debug(`DB Operation started: Client.${this.getOptions().op || 'find'}`);
});

clientSchema.post(/^find/, function(result) {
  const duration = Date.now() - this._startTime;
  const operation = this.getOptions().op || 'find';
  const resultCount = Array.isArray(result) ? result.length : (result ? 1 : 0);
  
  logDatabase.queryExecution('Client', operation, duration);
  logger.debug(`DB Operation completed: Client.${operation} returned ${resultCount} document(s) in ${duration}ms`);
});

clientSchema.post(/^find/, function(error, result, next) {
  if (error) {
    const operation = this.getOptions().op || 'find';
    logDatabase.operationError(`Client.${operation}`, error);
    logger.error(`DB Operation failed: Client.${operation} - ${error.message}`);
  }
  if (next) next(error);
});

// Log remove operations
clientSchema.pre('remove', function() {
  this._startTime = Date.now();
  logger.debug(`DB Operation started: Client.remove for ID: ${this._id}`);
});

clientSchema.post('remove', function(doc) {
  const duration = Date.now() - this._startTime;
  logDatabase.queryExecution('Client', 'remove', duration);
  logger.info(`DB Operation completed: Client.remove for ID: ${doc._id} in ${duration}ms`);
});

module.exports = mongoose.model('Client', clientSchema);