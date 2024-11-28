const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Register a user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Get user profile
router.get('/:userId', authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/:userId', authMiddleware, userController.updateUserProfile);

module.exports = router;
