const eventService = require('../services/eventService');

const getAllEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const userId = req.user_id;
    try {
        const [events, eventsCount] = await eventService.getAllEvents(page, userId);
        res.status(200).json({
            status: 'success',
            events: events.length,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(eventsCount / 10),
                eventsCount: eventsCount,
                hasNextPage: page * 10 < eventsCount,
                hasPrevPage: page > 1
            },
            data: events
        });
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

const updateEvent = async(req, res) => {
    const eventId = req.params.id;
    const updateData = req.body;
    try {
        const updatedEvent = await eventService.updateEvent(eventId, updateData);
        res.status(200).json(updatedEvent);
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
    updateEvent,

}