const { default: mongoose } = require('mongoose');
const Event = require('../models/Event');

const fetchEvents = async (page, userId) => {
    userId = new mongoose.Types.ObjectId(userId);
    const limit = 10;
    const skip = (page - 1) * limit;
    try{
        const results = await Promise.all([
            Event.aggregate([
                //pagination logic
                { $sort : { startDate : 1}},
                { $skip: skip },
                { $limit: limit },

                {
                    $lookup: {
                        from: 'users',
                        let: { creatorId: "$createdBy" }, 
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$creatorId"] } } },
                            { $project: { _id: 1, username: 1 } } 
                        ],
                        as: 'creator'
                    }
                },
                { $unwind: {
                    path: '$creator',
                    preserveNullAndEmptyArrays: true
                    }
                },

                //add isAttendee and hasStarted fields
                { $addFields: {
                    isAttendee: {$in: [userId, "$attendees"]},
                    hasStarted: {$lte: ["$startDate", new Date()]}
                }},

                { $project: {
                    __v: 0,
                    createdBy: 0
                }}
            ]),
            Event.countDocuments()
        ])
        return results;
    } catch(error) {
        throw new Error('Error fetching events: ' + error.message);
    }
}

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

const getAllEvents = async (page, userId) => {
    try{
        const results = await fetchEvents(page, userId);
        return results;
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

const updateEvent = async(eventId, updateData) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });
        return updatedEvent;
    } catch(error) {
        throw new Error('Error updating event: ' + error.message);
    }
}

module.exports = {
    getAllEvents,
    getMyEvents,
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent,

}