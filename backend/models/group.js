const mongoose = require('mongoose');

// Define the Group Schema
const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
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
GroupSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Create and export the Group model
const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
