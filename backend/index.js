const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // Connect MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
    res.send('PeerConnect Backend is Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

