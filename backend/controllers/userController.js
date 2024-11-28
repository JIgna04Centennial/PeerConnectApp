// Import necessary libraries
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const admin = require('../firebase'); // Import Firebase Admin SDK

// Register a new User
async function registerUser(req, res) {
    console.log('Registering a new user with Firebase Authentication');
    try {
        const { email, password, username, interests } = req.body;

        // Create the user in Firebase Authentication
        const firebaseUser = await admin.auth().createUser({
            email,
            password,
        });
        console.log('Firebase user created:', firebaseUser.uid);

        // Save additional user data in your database
        const user = new User({
            username,
            email,
            firebaseUid: firebaseUser.uid, // Link Firebase UID to your database user
            interests,
        });
        console.log('Saving user to the database');
        const savedUser = await user.save();

        console.log('User registered successfully');
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Login a User
async function loginUser(req, res) {
    // Retrieve the ID token from bearer
    const authHeader  = req.header('Authorization');

    console.log('Validating Firebase ID Token:', authHeader );
    if (!authHeader) {
        return res.status(400).json({ message: 'ID Token is required' });
    }

    // Validate the Authorization header
    if (!authHeader) {
        return res.status(400).json({ message: 'Authorization header is missing' });
    }

    // Check if the token is in the Bearer format
    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
        return res.status(400).json({ message: 'Invalid Authorization header format. Expected format: Bearer <token>' });
    }

    // Extract the ID token
    const idToken = tokenParts[1];
    console.log('Received ID Token:', idToken);

    try {
        // Verify the Firebase ID token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log('Decoded Token:', decodedToken);

        // Find the user in the database using Firebase UID
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            console.log('User not found in the database');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User logged in successfully');
        res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                interests: user.interests,
                profile_pic: user.profile_pic,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }, // Send back user details, excluding sensitive information like firebaseUid
        });
    } catch (err) {
        console.error('Error verifying Firebase ID Token:', err.message);
        res.status(401).json({ message: 'Invalid or expired ID token' });
    }
}

module.exports = {
    loginUser,
    // Include other exported functions like registerUser, getUserProfile, etc.
};


async function getUserProfile(req, res) {
    console.log('Fetching User Profile');
    try {
        const identifier = req.params.userId;
        console.log(`Identifier received: ${identifier}`);

        let user = null;

        // Check if identifier is a valid ObjectId to look up by MongoDB `_id`
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            console.log(`Looking up by MongoDB ObjectId: ${identifier}`);
            user = await User.findById(identifier).select('-firebaseUid'); // Exclude Firebase UID if you don’t want to return it
        }

        // If no user found by ObjectId, look up by `username`
        if (!user) {
            console.log(`Looking up by username: ${identifier}`);
            user = await User.findOne({ username: identifier }).select('-firebaseUid');
        }

        // If user is still not found, log an error message
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User profile retrieved successfully');
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: err.message });
    }
}


// Update User Profile
async function updateUserProfile(req, res) {
    console.log('Updating User Profile');
    try {
        // Assuming Firebase Authentication Middleware populates `req.user` with user info
        const firebaseUid = req.user.uid;
        console.log(`Updating User with Firebase UID: ${firebaseUid}`);

        // Extract the fields to be updated from the request body
        const updateData = {};
        if (req.body.interests) {
            updateData.interests = req.body.interests; // Update interests if provided
        }
        if (req.body.profile_pic) {
            updateData.profile_pic = req.body.profile_pic; // Update profile picture if provided
        }

        // Ensure we're only updating `interests` and `profile_pic`
        console.log('Fields to be updated:', updateData);

        // Find and update the user using Firebase UID
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid },        // Search by firebaseUid
            updateData,             // Only update fields specified in `updateData`
            { new: true }           // Return the updated document
        );

        if (!updatedUser) {
            console.log('User not found for update');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User profile updated successfully');
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user profile:', err.message);
        res.status(400).json({ error: err.message });
    }
}

// Export all user controller functions
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
};
