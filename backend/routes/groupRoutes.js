// Import necessary libraries
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new Group
router.post('/', authMiddleware, groupController.createGroup);

// Get all Groups
router.get('/', authMiddleware, groupController.getAllGroups);

// Get a specific Group by ID
router.get('/:groupId', authMiddleware, groupController.getGroupById);

// Update a Group by ID
router.put('/:groupId', authMiddleware, groupController.updateGroup);

// Delete a Group by ID
router.delete('/:groupId', authMiddleware, groupController.deleteGroup);

// Join a Group
router.put('/:groupId/join', authMiddleware, groupController.joinGroup);

module.exports = router;
