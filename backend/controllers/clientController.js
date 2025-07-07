const Client = require('../models/Client');
const ClientInvitation = require('../models/ClientInvitation');
const Advisor = require('../models/Advisor');
const { logger, logAuth, logApi, logSecurity } = require('../utils/logger');
const nodemailer = require('nodemailer');

// Create email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const getInvitationEmailTemplate = (advisorName, advisorFirm, clientName, invitationUrl, expiryHours) => {
  return {
    subject: `Complete Your Financial Profile - ${advisorFirm || 'Richie AI'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .button { background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .footer { background-color: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          .warning { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Richie AI</h1>
            <p>Your Financial Advisory Platform</p>
          </div>
          
          <div class="content">
            <h2>Hello ${clientName || 'Valued Client'},</h2>
            
            <p>You have been invited by <strong>${advisorName}</strong> ${advisorFirm ? `from <strong>${advisorFirm}</strong>` : ''} to complete your financial profile on our secure platform.</p>
            
            <p>To get started with your personalized financial planning journey, please click the button below to complete your profile:</p>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">Complete Your Profile</a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This invitation link will expire in ${expiryHours} hours for security reasons. Please complete your profile before then.
            </div>
            
            <p>What you'll need to complete your profile:</p>
            <ul>
              <li>Personal information (name, contact details, address)</li>
              <li>Financial information (income, net worth, investment goals)</li>
              <li>KYC documents (PAN, Aadhar, address proof)</li>
              <li>Bank account details</li>
            </ul>
            
            <p>Your information is completely secure and will only be used to provide you with personalized financial advice.</p>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact your advisor or our support team.</p>
            
            <p>Best regards,<br>
            The Richie AI Team</p>
            
            <hr>
            <p style="font-size: 11px; color: #6b7280;">
              If you cannot click the button above, copy and paste this link into your browser:<br>
              <a href="${invitationUrl}">${invitationUrl}</a>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2025 Richie AI. All rights reserved.</p>
            <p>This email was sent to you by your financial advisor. If you received this email by mistake, please ignore it.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Get all clients for an advisor
const getClients = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  
  try {
    logger.info(`Client list request for advisor: ${advisorId}`);
    
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { advisor: advisorId };
    
    // Add search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    // Execute query
    const clients = await Client.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('advisor', 'firstName lastName firmName');
    
    const totalClients = await Client.countDocuments(query);
    const totalPages = Math.ceil(totalClients / limit);
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    logger.info(`Client list retrieved successfully for advisor: ${advisorId} - ${clients.length} clients found`);
    
    res.json({
      success: true,
      data: {
        clients,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalClients,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client list retrieval failed for advisor: ${advisorId} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve clients',
      error: error.message
    });
  }
};

// Get client by ID
const getClientById = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  const { id } = req.params;
  
  try {
    logger.info(`Client details request for advisor: ${advisorId}, client: ${id}`);
    
    const client = await Client.findOne({ _id: id, advisor: advisorId })
      .populate('advisor', 'firstName lastName firmName');
    
    if (!client) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 404, duration, advisorId);
      
      logger.warn(`Client not found for advisor: ${advisorId}, client: ${id}`);
      
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    logger.info(`Client details retrieved successfully for advisor: ${advisorId}, client: ${id}`);
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client details retrieval failed for advisor: ${advisorId}, client: ${id} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve client details',
      error: error.message
    });
  }
};

// Send client invitation
const sendClientInvitation = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    const { clientEmail, clientFirstName, clientLastName, notes } = req.body;
    
    // Validate required fields
    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Client email is required'
      });
    }
    
    logger.info(`Client invitation request for advisor: ${advisorId}, client email: ${clientEmail}`);
    
    // Check if client already exists
    const existingClient = await Client.findOne({ 
      email: clientEmail.toLowerCase(), 
      advisor: advisorId 
    });
    
    if (existingClient) {
      logger.warn(`Client invitation failed - client already exists: ${clientEmail} for advisor: ${advisorId}`);
      return res.status(400).json({
        success: false,
        message: 'Client already exists in your account'
      });
    }
    
    // Check if maximum invitations limit reached (5 per client)
    const invitationCount = await ClientInvitation.countDocuments({
      clientEmail: clientEmail.toLowerCase(),
      advisor: advisorId
    });
    
    if (invitationCount >= 5) {
      logger.warn(`Client invitation failed - maximum invitations reached: ${clientEmail} for advisor: ${advisorId} (${invitationCount}/5)`);
      return res.status(400).json({
        success: false,
        message: `Maximum of 5 invitations reached for this client. Current count: ${invitationCount}/5`
      });
    }
    
    // Get advisor details for email
    const advisor = await Advisor.findById(advisorId);
    
    // Create invitation
    const invitation = new ClientInvitation({
      clientEmail: clientEmail.toLowerCase(),
      clientFirstName,
      clientLastName,
      advisor: advisorId,
      notes,
      invitationSource: 'manual'
    });
    
    await invitation.save();
    
    // Generate invitation URL
    const invitationUrl = invitation.generateInvitationUrl();
    const expiryHours = process.env.INVITATION_EXPIRY_HOURS || 48;
    
    // Send email
    const transporter = createEmailTransporter();
    const emailTemplate = getInvitationEmailTemplate(
      `${advisor.firstName} ${advisor.lastName}`,
      advisor.firmName,
      clientFirstName ? `${clientFirstName} ${clientLastName || ''}`.trim() : '',
      invitationUrl,
      expiryHours
    );
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: clientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    });
    
    // Mark invitation as sent
    await invitation.markAsSent();
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    // Get updated invitation count for logging
    const finalInvitationCount = invitationCount + 1;
    logger.info(`Client invitation sent successfully for advisor: ${advisorId}, client: ${clientEmail}, invitation: ${invitation._id} - Count: ${finalInvitationCount}/5`);
    
    res.json({
      success: true,
      message: `Client invitation sent successfully! (${finalInvitationCount}/5 invitations used)`,
      data: {
        invitationId: invitation._id,
        clientEmail: clientEmail,
        expiresAt: invitation.expiresAt,
        invitationUrl: invitationUrl,
        invitationCount: finalInvitationCount,
        maxInvitations: 5
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client invitation failed for advisor: ${advisorId} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send client invitation',
      error: error.message
    });
  }
};

// Get client invitations
const getClientInvitations = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  
  try {
    logger.info(`Client invitations request for advisor: ${advisorId}`);
    
    const {
      page = 1,
      limit = 10,
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = { advisor: advisorId };
    
    // Add status filter
    if (status) {
      query.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    // Execute query
    const invitations = await ClientInvitation.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('advisor', 'firstName lastName firmName')
      .populate('clientData', 'firstName lastName email status');
    
    const totalInvitations = await ClientInvitation.countDocuments(query);
    const totalPages = Math.ceil(totalInvitations / limit);
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    logger.info(`Client invitations retrieved successfully for advisor: ${advisorId} - ${invitations.length} invitations found`);
    
    res.json({
      success: true,
      data: {
        invitations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalInvitations,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client invitations retrieval failed for advisor: ${advisorId} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve client invitations',
      error: error.message
    });
  }
};

// Update client information
const updateClient = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  const { id } = req.params;
  
  try {
    logger.info(`Client update request for advisor: ${advisorId}, client: ${id}`);
    
    const client = await Client.findOne({ _id: id, advisor: advisorId });
    
    if (!client) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 404, duration, advisorId);
      
      logger.warn(`Client not found for update - advisor: ${advisorId}, client: ${id}`);
      
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Update client data
    const updateData = { ...req.body };
    delete updateData.advisor; // Prevent advisor change
    
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('advisor', 'firstName lastName firmName');
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    logger.info(`Client updated successfully for advisor: ${advisorId}, client: ${id}`);
    
    res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client update failed for advisor: ${advisorId}, client: ${id} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to update client',
      error: error.message
    });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const advisorId = req.advisor.id;
  const { id } = req.params;
  
  try {
    logger.info(`Client deletion request for advisor: ${advisorId}, client: ${id}`);
    
    const client = await Client.findOne({ _id: id, advisor: advisorId });
    
    if (!client) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 404, duration, advisorId);
      
      logger.warn(`Client not found for deletion - advisor: ${advisorId}, client: ${id}`);
      
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    await Client.findByIdAndDelete(id);
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration, advisorId);
    
    logger.info(`Client deleted successfully for advisor: ${advisorId}, client: ${id}`);
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error, advisorId);
    
    logger.error(`Client deletion failed for advisor: ${advisorId}, client: ${id} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete client',
      error: error.message
    });
  }
};

// Public endpoint - Get client onboarding form by token
const getClientOnboardingForm = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const { token } = req.params;
  const clientIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  try {
    logger.info(`Client onboarding form request for token: ${token}`);
    
    const invitation = await ClientInvitation.findOne({ token })
      .populate('advisor', 'firstName lastName firmName email');
    
    if (!invitation) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 404, duration);
      
      logger.warn(`Invalid invitation token: ${token}`);
      
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation link'
      });
    }
    
    if (invitation.isExpired) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 410, duration);
      
      logger.warn(`Expired invitation token: ${token}`);
      
      return res.status(410).json({
        success: false,
        message: 'Invitation link has expired'
      });
    }
    
    if (invitation.status === 'completed') {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 410, duration);
      
      logger.warn(`Already completed invitation token: ${token}`);
      
      return res.status(410).json({
        success: false,
        message: 'This invitation has already been completed'
      });
    }
    
    // Mark invitation as opened
    await invitation.markAsOpened(clientIp, userAgent);
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration);
    
    logger.info(`Client onboarding form accessed successfully for token: ${token}`);
    
    res.json({
      success: true,
      data: {
        invitation: {
          id: invitation._id,
          clientEmail: invitation.clientEmail,
          clientFirstName: invitation.clientFirstName,
          clientLastName: invitation.clientLastName,
          expiresAt: invitation.expiresAt,
          timeRemaining: invitation.timeRemaining
        },
        advisor: invitation.advisor
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error);
    
    logger.error(`Client onboarding form access failed for token: ${token} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to access onboarding form',
      error: error.message
    });
  }
};

// Public endpoint - Submit client onboarding form
const submitClientOnboardingForm = async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;
  const { token } = req.params;
  const clientIp = req.ip || req.connection.remoteAddress;
  
  try {
    logger.info(`Client onboarding form submission for token: ${token}`);
    
    const invitation = await ClientInvitation.findOne({ token });
    
    if (!invitation) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 404, duration);
      
      logger.warn(`Invalid invitation token for submission: ${token}`);
      
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation link'
      });
    }
    
    if (invitation.isExpired) {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 410, duration);
      
      logger.warn(`Expired invitation token for submission: ${token}`);
      
      return res.status(410).json({
        success: false,
        message: 'Invitation link has expired'
      });
    }
    
    if (invitation.status === 'completed') {
      const duration = Date.now() - startTime;
      logApi.response(method, url, 410, duration);
      
      logger.warn(`Already completed invitation token for submission: ${token}`);
      
      return res.status(410).json({
        success: false,
        message: 'This invitation has already been completed'
      });
    }
    
    // Create client record
    const clientData = {
      ...req.body,
      email: invitation.clientEmail,
      advisor: invitation.advisor,
      status: 'onboarding'
    };
    
    const client = new Client(clientData);
    await client.save();
    
    // Mark invitation as completed
    await invitation.markAsCompleted(client._id);
    
    const duration = Date.now() - startTime;
    logApi.response(method, url, 200, duration);
    
    logger.info(`Client onboarding completed successfully for token: ${token}, client: ${client._id}`);
    
    res.json({
      success: true,
      message: 'Client onboarding completed successfully',
      data: {
        clientId: client._id,
        status: client.status
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logApi.error(method, url, error);
    
    logger.error(`Client onboarding form submission failed for token: ${token} - ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to complete onboarding',
      error: error.message
    });
  }
};

module.exports = {
  getClients,
  getClientById,
  sendClientInvitation,
  getClientInvitations,
  updateClient,
  deleteClient,
  getClientOnboardingForm,
  submitClientOnboardingForm
};