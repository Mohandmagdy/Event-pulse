const Event = require('../models/Event');

const getEventById = async(event_id) => {
    try{
        const event = await Event.findById(event_id).populate('createdBy');
        return event;
    } catch(error) {
        throw new Error('Error fetching event details: ' + error.message);
    }
}

const deleteEvent = async(event_id) => {
    try{
        await Event.findByIdAndDelete(event_id);
        return;
    } catch(error) {
        throw new Error('Error deleting event: ' + error.message);
    }
}

const getAllEvents = async () => {
    try{
        const events = await Event.find().populate('createdBy');
        return events;
    } catch(error) {
        throw new Error('Error fetching events: ' + error.message);
    }
}

const getMyEvents = async (userId) => {
    try{
        const events = await Event.find({ createdBy: userId });
        return events;
    } catch(error) {
        throw new Error('Error fetching user events: ' + error.message);
    }
}

const createEvent = async (eventData, userId) => {
    try{
        eventData.createdBy = userId;
        const event = new Event(eventData);
        await event.save();
        return event;
    } catch(error) {
        throw new Error('Error creating event: ' + error.message);
    }
}

module.exports = {
    getAllEvents,
    getMyEvents,
    createEvent,
    getEventById,
    deleteEvent,

}