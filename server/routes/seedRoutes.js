const express = require('express');
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Admin = require('../models/Admin');
const User = require('../models/User');
const seedDatabase = require('../utils/seedHelper');

const router = express.Router();

// @desc    Seed database with demo destinations, packages, admin, and user
// @route   POST /api/seed
// @access  Public (guarded by env check)
router.post('/', async (req, res) => {
  try {
    const destCount = await Destination.countDocuments();
    const pkgCount = await Package.countDocuments();
    const isDbEmpty = destCount === 0 && pkgCount === 0;

    // Allow seeding if NOT in production, OR if database is completely empty, OR if ALLOW_SEEDING=true is configured in Vercel.
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEEDING !== 'true' && !isDbEmpty) {
      return res.status(403).json({ 
        success: false, 
        message: 'Seeding is disabled in production to prevent data loss. Set ALLOW_SEEDING=true in Vercel to override.' 
      });
    }

    await seedDatabase();
    
    // Fetch counts post-seeding to send back to client
    const newDestCount = await Destination.countDocuments();
    const newPkgCount = await Package.countDocuments();
    
    res.status(200).json({
      success: true,
      message: '✅ Database seeded successfully!',
      destinations: newDestCount,
      packages: newPkgCount,
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: `Seeding failed: ${err.message}` });
  }
});

// @desc    Status check
// @route   GET /api/seed/status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const destCount = await Destination.countDocuments();
    const pkgCount = await Package.countDocuments();
    const adminCount = await Admin.countDocuments();
    const userCount = await User.countDocuments();
    res.json({
      success: true,
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      destinations: destCount,
      packages: pkgCount,
      admins: adminCount,
      users: userCount,
      message: destCount === 0
        ? '⚠️ No destinations found. POST to /api/seed to populate demo data.'
        : `✅ Database has ${destCount} destinations and ${pkgCount} packages.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
