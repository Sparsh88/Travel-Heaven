const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add a user for this booking'],
      index: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Please associate a destination'],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Please associate a package'],
    },
    amount: {
      type: Number,
      required: true,
    },
    travelDate: {
      type: Date,
      required: [true, 'Please specify a travel date'],
    },
    numberOfTravelers: {
      type: Number,
      required: [true, 'Please specify the number of travelers'],
      min: [1, 'Must have at least 1 traveler'],
      default: 1,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    hasGuide: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    trackingStatus: {
      type: String,
      enum: ['Booking Confirmed', 'Documents Verified', 'Tickets Generated', 'Travel Started', 'Trip Completed'],
      default: 'Booking Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    ticketUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
