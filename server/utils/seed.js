const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDatabase = require('./seedHelper');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-heaven';
    console.log(`Connecting to database for seeding: ${mongoUri.replace(/:([^@:]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to database successfully.');

    await seedDatabase();
    
    console.log('Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
};

run();
