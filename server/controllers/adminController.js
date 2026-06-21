const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const jwt = require('jsonwebtoken');

// Helper to send Admin Token
const sendAdminTokenResponse = (admin, statusCode, res) => {
  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || 'supersecretkeytravelheaven2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('adminToken', token, options)
    .json({
      success: true,
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email/username and password' });
    }

    // Check for admin
    const admin = await Admin.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
    }).select('+password');

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    sendAdminTokenResponse(admin, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Admin logout
// @route   GET /api/admin/logout
// @access  Private/Admin
exports.adminLogout = async (req, res, next) => {
  try {
    res.cookie('adminToken', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: 'Admin logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBookings = await Booking.countDocuments();
    
    // Revenue from Paid bookings
    const paidBookings = await Booking.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidBookings.reduce((sum, b) => sum + b.amount, 0);

    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });

    // Monthly revenue chart mock
    const monthlyRevenue = [
      { month: 'Jan', revenue: totalRevenue * 0.1 },
      { month: 'Feb', revenue: totalRevenue * 0.15 },
      { month: 'Mar', revenue: totalRevenue * 0.2 },
      { month: 'Apr', revenue: totalRevenue * 0.18 },
      { month: 'May', revenue: totalRevenue * 0.22 },
      { month: 'Jun', revenue: totalRevenue * 0.15 },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        monthlyRevenue,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    View all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' }).sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Edit user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete bookings & reviews
    await Booking.deleteMany({ user: user._id });
    await Payment.deleteMany({ user: user._id });
    // Note: Reviews aggregation will recalculate after delete
    const reviews = await Review.find({ user: user._id });
    for (const r of reviews) {
      const destId = r.destination;
      await r.deleteOne();
      await Review.getAverageRating(destId);
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ success: true, message: 'User deleted and all associated records purged' });
  } catch (err) {
    next(err);
  }
};

// @desc    View all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'fullName email phoneNumber')
      .populate('destination', 'name country')
      .populate('package', 'title price')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Confirm booking
// @route   PUT /api/admin/bookings/:id/confirm
// @access  Private/Admin
exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'Confirmed';
    booking.trackingStatus = 'Documents Verified';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking confirmed', data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject/Cancel booking
// @route   PUT /api/admin/bookings/:id/reject
// @access  Private/Admin
exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking rejected/cancelled', data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking tracking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, trackingStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (trackingStatus) booking.trackingStatus = trackingStatus;

    await booking.save();

    res.status(200).json({ success: true, message: 'Booking status updated', data: booking });
  } catch (err) {
    next(err);
  }
};

// @desc    View all transaction payments
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Payment.find()
      .populate('user', 'fullName email')
      .populate({
        path: 'booking',
        populate: {
          path: 'package',
          select: 'title',
        },
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    next(err);
  }
};
