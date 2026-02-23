const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeFirebase } = require('./config/firebase');
const authMiddleware = require('./middleware/auth');
const notesRoutes = require('./routes/notes');
const notebooksRoutes = require('./routes/notebooks');

// Initialize Firebase
initializeFirebase();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Authentication middleware for API routes
app.use('/api', authMiddleware);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Notes API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/notes', notesRoutes);
app.use('/api/notebooks', notebooksRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;
