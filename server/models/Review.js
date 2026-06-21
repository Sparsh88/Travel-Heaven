const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
      index: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Review must link to a destination'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same destination
reviewSchema.index({ destination: 1, user: 1 }, { unique: true });

// Static method to get avg rating and update destination
reviewSchema.statics.getAverageRating = async function (destinationId) {
  const obj = await this.aggregate([
    {
      $match: { destination: destinationId },
    },
    {
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await mongoose.model('Destination').findByIdAndUpdate(destinationId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].reviewsCount,
      });
    } else {
      await mongoose.model('Destination').findByIdAndUpdate(destinationId, {
        rating: 0,
        reviewsCount: 0,
      });
    }
  } catch (err) {
    console.error(`Error calculating average rating: ${err.message}`);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.destination);
});

// Call getAverageRating before delete
reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.getAverageRating(this.destination);
});

module.exports = mongoose.model('Review', reviewSchema);
