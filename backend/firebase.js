const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
