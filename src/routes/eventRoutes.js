const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/mine', eventController.getMyEvents);
router.get('/:id', eventController.getEventDetails);
router.post('/create', eventController.createEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;