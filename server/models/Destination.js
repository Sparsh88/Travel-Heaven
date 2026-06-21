const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a destination name'],
      trim: true,
      unique: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Domestic', 'International'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image URL'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    budgetCategory: {
      type: String,
      enum: ['Budget', 'Mid-Range', 'Luxury'],
      default: 'Mid-Range',
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

module.exports = mongoose.model('Destination', destinationSchema);
