const express = require('express');
const jwt = require('jsonwebtoken');
const { processPayment, getTransaction } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const Admin = require('../models/Admin');

const router = express.Router();

// Helper combined auth for transaction details
const combinedAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies) {
    token = req.cookies.token || req.cookies.adminToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeytravelheaven2026');
    
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
      return next();
    }

    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.admin = admin;
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized to access this resource' });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token validation failed' });
  }
};

router.post('/checkout', protect, processPayment);
router.get('/:id', combinedAuth, getTransaction);

module.exports = router;
