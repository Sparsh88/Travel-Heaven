const express = require('express');
const { submitContact, getContacts } = require('../controllers/contactController');
const { protectAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protectAdmin, getContacts);

module.exports = router;
