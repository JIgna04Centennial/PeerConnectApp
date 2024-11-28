const admin = require('../firebase'); // Ensure you have imported Firebase Admin

// Firebase Authentication Middleware
const authMiddleware = async (req, res, next) => {
    console.log('Auth Middleware: Starting token verification');

    // Retrieve token from the Authorization header
    const authHeader = req.header('Authorization');
    console.log('Auth Middleware: Received Authorization header:', authHeader);

    if (!authHeader) {
        console.error('Auth Middleware: Authorization header missing');
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    // Remove 'Bearer ' prefix if present
    const token = authHeader.split(' ')[1];
    console.log('Auth Middleware: Extracted token:', token);

    if (!token) {
        console.error('Auth Middleware: Token missing from Authorization header');
        return res.status(401).json({ message: 'Access Denied: Token missing' });
    }

    try {
        // Verify the Firebase token
        console.log('Auth Middleware: Verifying Firebase token');
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Auth Middleware: Token verified successfully. Decoded token:', decodedToken);

        // Attach user info to request object for further use
        req.user = decodedToken;

        // Call next() to proceed to the next middleware or route handler
        console.log('Auth Middleware: Proceeding to the next middleware or route handler');
        next();
    } catch (err) {
        console.error('Auth Middleware: Firebase token verification failed:', err.message);
        res.status(401).json({ message: 'Invalid token or Unauthorized' });
    }
};

module.exports = authMiddleware;
