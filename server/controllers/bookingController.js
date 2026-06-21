const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Destination = require('../models/Destination');

// Helper to generate a unique booking ID (e.g., TH-729481)
const generateBookingId = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `TH-${digits}`;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { destinationId, packageId, travelDate, numberOfTravelers, specialRequests, hasGuide } = req.body;

    if (!destinationId || !packageId || !travelDate || !numberOfTravelers) {
      return res.status(400).json({ success: false, message: 'Please provide all booking fields' });
    }

    // Check if package exists and matches destination
    const tourPackage = await Package.findById(packageId);
    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Tour package not found' });
    }

    if (tourPackage.destination.toString() !== destinationId) {
      return res.status(400).json({ success: false, message: 'Package does not match destination' });
    }

    // Calculate total price
    const guideCost = hasGuide ? (1500 * tourPackage.durationDays) : 0;
    const totalAmount = (tourPackage.price * parseInt(numberOfTravelers)) + guideCost;

    // Generate unique booking code
    let bookingCode = generateBookingId();
    let codeExists = await Booking.findOne({ bookingId: bookingCode });
    while (codeExists) {
      bookingCode = generateBookingId();
      codeExists = await Booking.findOne({ bookingId: bookingCode });
    }

    const booking = await Booking.create({
      bookingId: bookingCode,
      user: req.user.id,
      destination: destinationId,
      package: packageId,
      amount: totalAmount,
      travelDate,
      numberOfTravelers,
      specialRequests,
      hasGuide: !!hasGuide,
      status: 'Pending',
      trackingStatus: 'Booking Confirmed',
      paymentStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking detail
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'fullName email phoneNumber')
      .populate('destination')
      .populate('package');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership or check if caller is admin
    const isAdminCall = req.admin ? true : false;
    const isOwnerCall = booking.user._id.toString() === req.user?.id;

    if (!isAdminCall && !isOwnerCall) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
    }

    // Check if trip already started or completed
    if (['In Progress', 'Completed'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel a trip that is in progress or completed' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};
