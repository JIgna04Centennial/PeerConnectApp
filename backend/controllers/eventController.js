// Import necessary libraries
const Event = require('../models/event');
const Group = require('../models/group');

// Create a new Event
async function createEvent(req, res) {
    console.log('Creating a new Event');
    try {
        console.log('Creating Event object');
        const event = new Event({
            group_id: req.body.group_id,
            event_name: req.body.event_name,
            event_date: req.body.event_date,
            location: req.body.location,
            created_by: req.body.userId,
        });

        console.log('Saving Event to database');
        const savedEvent = await event.save();
        console.log('Event created successfully');
        res.status(201).json(savedEvent);
    } catch (err) {
        console.log('Error creating Event:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Get all Events
async function getAllEvents(req, res) {
    console.log('Fetching all Events');
    try {
        const events = await Event.find();
        console.log('All Events retrieved successfully');
        res.json(events);
    } catch (err) {
        console.log('Error fetching Events:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Get a specific Event by ID
async function getEventById(req, res) {
    console.log('Fetching Event by ID');
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            console.log('Event not found');
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log('Event retrieved successfully');
        res.json(event);
    } catch (err) {
        console.log('Error fetching Event:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Update an Event by ID
async function updateEvent(req, res) {
    console.log('Updating Event by ID');
    try {
        console.log('Finding and updating Event');
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            req.body,
            { new: true }
        );
        if (!updatedEvent) {
            console.log('Event not found for update');
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log('Event updated successfully');
        res.json(updatedEvent);
    } catch (err) {
        console.log('Error updating Event:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Delete an Event by ID
async function deleteEvent(req, res) {
    console.log('Deleting Event by ID');
    try {
        console.log('Finding and deleting Event');
        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
        if (!deletedEvent) {
            console.log('Event not found for deletion');
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log('Event deleted successfully');
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.log('Error deleting Event:', err.message);
        res.status(500).json({ error: err.message });
    }
}

// Export all event controller functions
module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
