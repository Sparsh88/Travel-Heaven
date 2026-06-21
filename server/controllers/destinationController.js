const Destination = require('../models/Destination');
const Package = require('../models/Package');
const Review = require('../models/Review');

// @desc    Get all destinations with filters
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res, next) => {
  try {
    const { search, category, budget, rating } = req.query;
    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter (Domestic / International)
    if (category) {
      query.category = category;
    }

    // Budget filter (Budget, Mid-Range, Luxury)
    if (budget) {
      query.budgetCategory = budget;
    }

    // Rating filter (Minimum rating)
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const destinations = await Destination.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single destination with packages and reviews
// @route   GET /api/destinations/:id
// @access  Public
exports.getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Get packages associated with destination
    const packages = await Package.find({ destination: destination._id });

    // Get reviews associated with destination
    const reviews = await Review.find({ destination: destination._id }).populate({
      path: 'user',
      select: 'fullName',
    });

    res.status(200).json({
      success: true,
      data: destination,
      packages,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
exports.createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
exports.updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
exports.deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Delete associated packages
    await Package.deleteMany({ destination: destination._id });

    // Delete associated reviews
    await Review.deleteMany({ destination: destination._id });

    // Delete the destination itself
    await Destination.deleteOne({ _id: destination._id });

    res.status(200).json({
      success: true,
      message: 'Destination and associated packages/reviews deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
