const eventService = require('../services/eventService');

const getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const getMyEvents = async (req, res) => {
    const userId = req.user_id;
    try {
        const events = await eventService.getMyEvents(userId);
        res.status(200).json(events);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const createEvent = async (req, res) => {
    const eventData = req.body;
    const userId = req.user_id;
    try {
        const event = await eventService.createEvent(eventData, userId);
        res.status(201).json(event);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const getEventDetails = async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await eventService.getEventById(eventId);
        res.status(200).json(event);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        await eventService.deleteEvent(eventId);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllEvents,
    getMyEvents,
    createEvent,
    getEventDetails,
    deleteEvent,

}