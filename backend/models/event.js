const mongoose = require('mongoose');

// Define the Event Schema
const EventSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    event_name: {
        type: String,
        required: true,
        trim: true,
    },
    event_date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Use a pre-hook to update the `updated_at` field before each save
EventSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create and export the Event model
const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
