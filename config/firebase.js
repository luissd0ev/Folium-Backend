const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length === 0) {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    process.exit(1);
  }
};

// Get Firestore instance
const getFirestore = () => {
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getFirestore,
  admin,
};
