const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    interests: {
        type: [String], // Array of strings
        default: [],
    },
    profile_pic: {
        type: String,
        default: '',
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
UserSchema.pre('save', function (next) {
    // Update the `updated_at` field
    this.updated_at = Date.now();
    next();
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
