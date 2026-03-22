const express = require('express');
const router = express.Router();
const { register, login, getAllFarmers } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/farmers (admin only)
router.get('/farmers', auth, authorizeRoles('admin'), getAllFarmers);

module.exports = router;
