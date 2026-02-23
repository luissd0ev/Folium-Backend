const { admin } = require('../config/firebase');

/**
 * Middleware to verify Firebase Auth token
 * Extracts the userId from the token and attaches it to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If no token, use test user for now (backwards compatibility)
      req.user = {
        uid: process.env.TEST_USER_ID || 'test-user-123',
      };
      return next();
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    // If token is invalid, still allow with test user (backwards compatibility)
    req.user = {
      uid: process.env.TEST_USER_ID || 'test-user-123',
    };
    next();
  }
};

module.exports = authMiddleware;
