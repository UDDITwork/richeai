const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getClients,
  getClientById,
  sendClientInvitation,
  getClientInvitations,
  updateClient,
  deleteClient,
  getClientOnboardingForm,
  submitClientOnboardingForm
} = require('../controllers/clientController');

// Protected routes (require authentication)
router.use('/manage', auth);

// Invitation management routes (must come before parameterized routes)
router.post('/manage/invitations', sendClientInvitation);
router.get('/manage/invitations', getClientInvitations);

// Client management routes
router.get('/manage', getClients);
router.get('/manage/:id', getClientById);
router.put('/manage/:id', updateClient);
router.delete('/manage/:id', deleteClient);

// Public routes (no authentication required)
// Client onboarding form routes
router.get('/onboarding/:token', getClientOnboardingForm);
router.post('/onboarding/:token', submitClientOnboardingForm);

module.exports = router;