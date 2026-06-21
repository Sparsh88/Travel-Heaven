const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
} = require('../controllers/packageController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getPackages)
  .post(protectAdmin, createPackage);

router.route('/:id')
  .get(getPackage)
  .put(protectAdmin, updatePackage)
  .delete(protectAdmin, deletePackage);

module.exports = router;
