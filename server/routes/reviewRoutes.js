const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect); // All review actions require login

router.post('/', addReview);
router.delete('/:id', deleteReview);

module.exports = router;
