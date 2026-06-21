const express = require('express');
const { updateProfile, updatePassword, getUserBookings } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // Guard all user endpoints

router.put('/profile', updateProfile);
router.put('/updatepassword', updatePassword);
router.get('/bookings', getUserBookings);

module.exports = router;
