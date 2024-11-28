// Import necessary libraries
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new Event
router.post('/', authMiddleware, eventController.createEvent);

// Get all Events
router.get('/', authMiddleware, eventController.getAllEvents);

// Get a specific Event by ID
router.get('/:eventId', authMiddleware, eventController.getEventById);

// Update an Event by ID
router.put('/:eventId', authMiddleware, eventController.updateEvent);

// Delete an Event by ID
router.delete('/:eventId', authMiddleware, eventController.deleteEvent);

module.exports = router;
