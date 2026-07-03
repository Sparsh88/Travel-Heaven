const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const seedDatabase = require('../utils/seedHelper');

const connectDB = async () => {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log('Mock mode: skipping MongoDB connection');
    return;
  }

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If currently connecting, wait for it or just let the connection flow continue
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection is already in progress...');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-heaven');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if database is empty on connection
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Initiating background auto-seeding...');
      await seedDatabase();
      console.log('Database auto-seeded successfully!');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.VERCEL) {
      console.error('Bypassing process.exit(1) inside Vercel environment.');
      throw error; // Throw so that middleware can catch it and display a proper error page/message
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
