const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc    Add review for a destination
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const { destinationId, rating, comment } = req.body;

    if (!destinationId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide destination, rating, and comment' });
    }

    // Verify destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Check if user already reviewed this destination
    const alreadyReviewed = await Review.findOne({
      destination: destinationId,
      user: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this destination' });
    }

    const review = await Review.create({
      user: req.user.id,
      destination: destinationId,
      rating: parseInt(rating),
      comment,
    });

    // Populate user name before returning
    const populatedReview = await review.populate({
      path: 'user',
      select: 'fullName',
    });

    res.status(201).json({
      success: true,
      data: populatedReview,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const destinationId = review.destination;
    await Review.deleteOne({ _id: review._id });

    // Force recalculating ratings
    await Review.getAverageRating(destinationId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
