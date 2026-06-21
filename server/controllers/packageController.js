const Package = require('../models/Package');
const Destination = require('../models/Destination');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    const { destinationId, maxPrice, maxDays } = req.query;
    const query = {};

    if (destinationId) {
      query.destination = destinationId;
    }

    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    if (maxDays) {
      query.durationDays = { $lte: parseInt(maxDays) };
    }

    const packages = await Package.find(query).populate('destination').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
exports.getPackage = async (req, res, next) => {
  try {
    const tourPackage = await Package.findById(req.params.id).populate('destination');

    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({
      success: true,
      data: tourPackage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create package
// @route   POST /api/packages
// @access  Private/Admin
exports.createPackage = async (req, res, next) => {
  try {
    const { destination } = req.body;

    // Check if destination exists
    const dest = await Destination.findById(destination);
    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found to associate this package' });
    }

    const tourPackage = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: tourPackage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res, next) => {
  try {
    let tourPackage = await Package.findById(req.params.id);

    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Check destination if changing
    if (req.body.destination) {
      const dest = await Destination.findById(req.body.destination);
      if (!dest) {
        return res.status(404).json({ success: false, message: 'Destination not found to associate this package' });
      }
    }

    tourPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: tourPackage,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res, next) => {
  try {
    const tourPackage = await Package.findById(req.params.id);

    if (!tourPackage) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    await Package.deleteOne({ _id: tourPackage._id });

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
