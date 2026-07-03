const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/securityMiddleware');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Enable Mongoose mock mode if configured
if (process.env.USE_MOCK_DATA === 'true') {
  require('./mock/mockMongoose');
}

// Connect to Database (background connection on startup)
connectDB().catch(err => console.error('Database connection failed on startup:', err.message));

const app = express();

// Middleware to ensure DB connection is ready (critical for serverless / Vercel cold starts)
app.use(async (req, res, next) => {
  if (process.env.USE_MOCK_DATA === 'true') {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    try {
      console.log('Database connection is not ready. Attempting connection now...');
      await connectDB();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Please verify that your MongoDB connection string (MONGODB_URI) is correctly configured in Vercel.',
        error: err.message
      });
    }
  }
  next();
});

// Custom Cookie Parser middleware
app.use((req, res, next) => {
  req.cookies = {};
  const rawCookies = req.headers.cookie;
  if (rawCookies) {
    rawCookies.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        req.cookies[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  next();
});

// Security middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Turn off CSP during development for easy image loading from Unsplash
  })
);
app.use(cors({ origin: true, credentials: true }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));

// Mount API Routers with rate limit
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} to view the Travel Heaven application.`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = app;
