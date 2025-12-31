const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/check-in/:id', bookingController.checkIn);
router.get('/check-out/:id', bookingController.checkOut);

module.exports = router;