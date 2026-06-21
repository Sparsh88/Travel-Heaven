const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/securityMiddleware');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.post('/resetpassword/:token', authLimiter, resetPassword);

module.exports = router;
