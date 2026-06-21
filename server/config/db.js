const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.USE_MOCK_DATA === 'true') {
    console.log('Mock mode: skipping MongoDB connection');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-heaven');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
