const mongoose = require('mongoose');
const crypto = require('crypto');
const { logger, logDatabase } = require('../utils/logger');

const clientInvitationSchema = new mongoose.Schema({
  // Client Information
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  clientFirstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  clientLastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },

  // Advisor Information
  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advisor',
    required: [true, 'Advisor reference is required']
  },

  // Invitation Token
  token: {
    type: String,
    unique: true,
    index: true
  },

  // Status and Tracking
  status: {
    type: String,
    enum: ['pending', 'sent', 'opened', 'completed', 'expired', 'cancelled'],
    default: 'pending'
  },
  
  // Email Tracking
  sentAt: {
    type: Date
  },
  openedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  
  // Expiry Management
  expiresAt: {
    type: Date,
    index: true
  },
  
  // Form Data Tracking
  formStartedAt: {
    type: Date
  },
  formCompletedAt: {
    type: Date
  },
  
  // Email Details
  emailSubject: {
    type: String,
    default: 'Complete Your Financial Profile - Richie AI'
  },
  emailTemplate: {
    type: String,
    default: 'client_invitation'
  },
  
  // Attempts and Reminders
  emailAttempts: {
    type: Number,
    default: 0,
    max: 5
  },
  remindersSent: {
    type: Number,
    default: 0,
    max: 3
  },
  lastReminderSent: {
    type: Date
  },
  
  // Client Data Reference
  clientData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  
  // Additional Notes
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Invitation Metadata
  invitationSource: {
    type: String,
    enum: ['manual', 'bulk_upload', 'api', 'referral'],
    default: 'manual'
  },
  
  // IP and User Agent Tracking
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance
clientInvitationSchema.index({ advisor: 1, status: 1 });
clientInvitationSchema.index({ clientEmail: 1 });
clientInvitationSchema.index({ expiresAt: 1 });
clientInvitationSchema.index({ token: 1 }, { unique: true });

// Generate secure token and handle logging before saving
clientInvitationSchema.pre('save', function(next) {
  const startTime = Date.now();
  
  // Generate token and set expiry for new invitations
  if (this.isNew && !this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  
  // Set expiry if not set (default 48 hours)
  if (this.isNew && !this.expiresAt) {
    const expiryHours = process.env.INVITATION_EXPIRY_HOURS || 48;
    this.expiresAt = new Date(Date.now() + (expiryHours * 60 * 60 * 1000));
  }
  
  // Log the operation
  const isNew = this.isNew;
  const operation = isNew ? 'create' : 'update';
  const invitationId = this._id || 'new';
  
  logger.debug(`DB Operation started: ClientInvitation.${operation} for ID: ${invitationId}`);
  
  // Store start time for post middleware
  this._startTime = startTime;
  
  next();
});

// Virtual for checking if invitation is expired
clientInvitationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual for checking if invitation is active
clientInvitationSchema.virtual('isActive').get(function() {
  return this.status === 'sent' && !this.isExpired;
});

// Virtual for time remaining
clientInvitationSchema.virtual('timeRemaining').get(function() {
  if (this.isExpired) return 0;
  return Math.max(0, this.expiresAt - new Date());
});

// Ensure virtual fields are serialized
clientInvitationSchema.set('toJSON', { virtuals: true });
clientInvitationSchema.set('toObject', { virtuals: true });

// Method to generate invitation URL
clientInvitationSchema.methods.generateInvitationUrl = function() {
  const baseUrl = process.env.CLIENT_FORM_BASE_URL || 'http://localhost:5173/client-onboarding';
  return `${baseUrl}/${this.token}`;
};

// Method to mark as sent
clientInvitationSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.sentAt = new Date();
  this.emailAttempts += 1;
  return this.save();
};

// Method to mark as opened
clientInvitationSchema.methods.markAsOpened = function(ipAddress, userAgent) {
  if (this.status === 'sent') {
    this.status = 'opened';
    this.openedAt = new Date();
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }
  return this.save();
};

// Method to mark as completed
clientInvitationSchema.methods.markAsCompleted = function(clientId) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.formCompletedAt = new Date();
  this.clientData = clientId;
  return this.save();
};

// Method to send reminder
clientInvitationSchema.methods.sendReminder = function() {
  this.remindersSent += 1;
  this.lastReminderSent = new Date();
  return this.save();
};

// Static method to find active invitations
clientInvitationSchema.statics.findActiveInvitations = function(advisorId) {
  return this.find({
    advisor: advisorId,
    status: { $in: ['sent', 'opened'] },
    expiresAt: { $gt: new Date() }
  });
};

// Static method to find expired invitations
clientInvitationSchema.statics.findExpiredInvitations = function() {
  return this.find({
    status: { $in: ['sent', 'opened'] },
    expiresAt: { $lt: new Date() }
  });
};

// Static method to cleanup expired invitations
clientInvitationSchema.statics.cleanupExpiredInvitations = async function() {
  const result = await this.updateMany(
    {
      status: { $in: ['sent', 'opened'] },
      expiresAt: { $lt: new Date() }
    },
    { status: 'expired' }
  );
  
  logger.info(`Cleaned up ${result.modifiedCount} expired invitations`);
  return result;
};

// Mongoose middleware for logging database operations (consolidated with token generation above)

clientInvitationSchema.post('save', function(doc, next) {
  const duration = Date.now() - this._startTime;
  const operation = doc.isNew ? 'create' : 'update';
  
  logDatabase.queryExecution('ClientInvitation', operation, duration);
  logger.info(`DB Operation completed: ClientInvitation.${operation} for ID: ${doc._id} in ${duration}ms`);
  
  next();
});

clientInvitationSchema.post('save', function(error, doc, next) {
  if (error) {
    logDatabase.operationError('ClientInvitation.save', error);
    logger.error(`DB Operation failed: ClientInvitation.save for ID: ${doc?._id || 'unknown'} - ${error.message}`);
  }
  next(error);
});

// Log find operations
clientInvitationSchema.pre(/^find/, function() {
  this._startTime = Date.now();
  logger.debug(`DB Operation started: ClientInvitation.${this.getOptions().op || 'find'}`);
});

clientInvitationSchema.post(/^find/, function(result) {
  const duration = Date.now() - this._startTime;
  const operation = this.getOptions().op || 'find';
  const resultCount = Array.isArray(result) ? result.length : (result ? 1 : 0);
  
  logDatabase.queryExecution('ClientInvitation', operation, duration);
  logger.debug(`DB Operation completed: ClientInvitation.${operation} returned ${resultCount} document(s) in ${duration}ms`);
});

clientInvitationSchema.post(/^find/, function(error, result, next) {
  if (error) {
    const operation = this.getOptions().op || 'find';
    logDatabase.operationError(`ClientInvitation.${operation}`, error);
    logger.error(`DB Operation failed: ClientInvitation.${operation} - ${error.message}`);
  }
  if (next) next(error);
});

module.exports = mongoose.model('ClientInvitation', clientInvitationSchema);