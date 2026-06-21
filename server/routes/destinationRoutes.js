const express = require('express');
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getDestinations)
  .post(protectAdmin, createDestination);

router.route('/:id')
  .get(getDestination)
  .put(protectAdmin, updateDestination)
  .delete(protectAdmin, deleteDestination);

module.exports = router;
