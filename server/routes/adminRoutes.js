const express = require('express');
const {
  adminLogin,
  adminLogout,
  getAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  getBookings,
  confirmBooking,
  rejectBooking,
  updateBookingStatus,
  getTransactions,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/securityMiddleware');

const router = express.Router();

// Public login route
router.post('/login', authLimiter, adminLogin);

// Protected routes (admin session needed)
router.use(protectAdmin);

router.get('/logout', adminLogout);
router.get('/analytics', getAnalytics);

// User management
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Booking management
router.route('/bookings')
  .get(getBookings);

router.route('/bookings/:id/confirm')
  .put(confirmBooking);

router.route('/bookings/:id/reject')
  .put(rejectBooking);

router.route('/bookings/:id/status')
  .put(updateBookingStatus);

// Transaction logs
router.get('/transactions', getTransactions);

module.exports = router;
