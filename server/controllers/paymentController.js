const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Helper to generate transaction ID (e.g. TXN-724912)
const generateTxnId = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${digits}`;
};

// @desc    Process mockup payment gateway charge
// @route   POST /api/payments/checkout
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod, cardHolderName, cardNumber, upiId, netBankName } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Booking ID and payment method are required' });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay for this booking' });
    }

    // Check if already paid
    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'This booking has already been paid' });
    }

    // Mock payment gateway logic:
    // If card number contains '0000' or upiId contains 'fail', fail the transaction for testing
    let isSuccess = true;
    let failureReason = '';

    if (paymentMethod === 'Card') {
      if (!cardHolderName || !cardNumber) {
        return res.status(400).json({ success: false, message: 'Card details are incomplete' });
      }
      if (cardNumber.includes('0000')) {
        isSuccess = false;
        failureReason = 'Card declined by issuing bank (Simulated failure)';
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId) {
        return res.status(400).json({ success: false, message: 'UPI ID is required' });
      }
      if (upiId.toLowerCase().includes('fail')) {
        isSuccess = false;
        failureReason = 'UPI transaction timed out or rejected (Simulated failure)';
      }
    } else if (paymentMethod === 'NetBanking') {
      if (!netBankName) {
        return res.status(400).json({ success: false, message: 'NetBanking bank name is required' });
      }
    }

    const transactionId = generateTxnId();

    if (isSuccess) {
      // Create Payment transaction record
      const payment = await Payment.create({
        paymentId: transactionId,
        booking: booking._id,
        user: req.user.id,
        amount: booking.amount,
        paymentMethod,
        status: 'Successful',
        transactionDetails: {
          gateway: 'Stripe/Razorpay Mock',
          cardHolderName,
          upiId,
          bank: netBankName,
        },
      });

      // Update Booking details
      booking.paymentStatus = 'Paid';
      booking.status = 'Confirmed';
      booking.trackingStatus = 'Documents Verified'; // Advance to next milestone
      await booking.save();

      return res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment,
        booking,
      });
    } else {
      // Create Failed Payment record
      const payment = await Payment.create({
        paymentId: transactionId,
        booking: booking._id,
        user: req.user.id,
        amount: booking.amount,
        paymentMethod,
        status: 'Failed',
        transactionDetails: {
          gateway: 'Stripe/Razorpay Mock',
          reason: failureReason,
        },
      });

      // Update Booking details to Failed Payment
      booking.paymentStatus = 'Failed';
      await booking.save();

      return res.status(400).json({
        success: false,
        message: `Payment failed: ${failureReason}`,
        data: payment,
        booking,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get transaction details
// @route   GET /api/payments/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    let payment = await Payment.findOne({ paymentId: req.params.id })
      .populate({
        path: 'booking',
        populate: [
          { path: 'destination' },
          { path: 'package' }
        ]
      })
      .populate('user', 'fullName email');

    // If not found by paymentId, search by Booking's bookingId (e.g. TH-123456)
    if (!payment) {
      const booking = await Booking.findOne({ bookingId: req.params.id });
      if (booking) {
        payment = await Payment.findOne({ booking: booking._id })
          .populate({
            path: 'booking',
            populate: [
              { path: 'destination' },
              { path: 'package' }
            ]
          })
          .populate('user', 'fullName email');
      }
    }

    // If still not found and the parameter is a valid ObjectId, search by booking ObjectId or payment _id
    if (!payment && mongoose.Types.ObjectId.isValid(req.params.id)) {
      payment = await Payment.findOne({
        $or: [
          { _id: req.params.id },
          { booking: req.params.id }
        ]
      })
        .populate({
          path: 'booking',
          populate: [
            { path: 'destination' },
            { path: 'package' }
          ]
        })
        .populate('user', 'fullName email');
    }

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    // Check ownership or admin status
    const isAdminCall = req.admin ? true : false;
    const isOwnerCall = payment.user?._id.toString() === req.user?.id;

    if (!isAdminCall && !isOwnerCall) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this transaction' });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (err) {
    next(err);
  }
};
