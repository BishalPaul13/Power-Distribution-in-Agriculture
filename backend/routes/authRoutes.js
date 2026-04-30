const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllFarmers,
  grantSubsidy,
  consumeElectricity
} = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', auth, getMe);

// GET /api/auth/farmers (admin only)
router.get('/farmers', auth, authorizeRoles('admin'), getAllFarmers);

// POST /api/auth/farmers/:id/subsidy (admin only)
router.post('/farmers/:id/subsidy', auth, authorizeRoles('admin'), grantSubsidy);

// POST /api/auth/farmers/:id/usage (admin only)
router.post('/farmers/:id/usage', auth, authorizeRoles('admin'), consumeElectricity);

module.exports = router;
