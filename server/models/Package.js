const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a package title'],
      trim: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Please associate this package with a destination'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a package description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    durationDays: {
      type: Number,
      required: [true, 'Please add duration in days'],
    },
    durationNights: {
      type: Number,
      required: [true, 'Please add duration in nights'],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    images: {
      type: [String],
      default: [],
    },
    maxParticipants: {
      type: Number,
      default: 20,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Package', packageSchema);
