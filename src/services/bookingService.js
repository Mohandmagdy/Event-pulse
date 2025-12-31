const { default: mongoose } = require('mongoose');
const redisClient = require('../config/redis_config');
const Event = require('../models/Event');

const error_handler = async (eventId) => {
    const event = await Event.findById(eventId);
    if(!event){
        throw new Error('Event not found');
    } else if (event.endDate < new Date()){
        throw new Error('Event has already ended');
    } else {
        return 'already I/O';
    }
}

const checkIn = async (eventId, userId) => {
    try {
        const result = await Event.updateOne({_id: eventId, attendees: {$ne: userId}, endDate: {$gt: new Date()}}, {$push: {attendees: userId}});
        console.log(result.modifiedCount);
        if(result.modifiedCount === 1){
            //increase event counter
            await redisClient.INCR(`event:${eventId}:count`);
            //add event to live events set
            await redisClient.SADD(`live_events`, eventId);
            return;
        } 
        await error_handler(eventId);
        throw new Error("User already checked in.");
    } catch(error) {
        throw new Error('Error during check-in: ' + error.message);
    }
}

const checkOut = async (eventId, userId) => {
    try {
        const result = await Event.updateOne({_id: eventId, attendees: userId, endDate: {$gt: new Date()}}, {$pull: {attendees: userId}});
        if(result.modifiedCount === 1){
            //decrese event counter
            await redisClient.DECR(`event:${eventId}:count`);
            //add event to live events set
            await redisClient.SADD(`live_events`, eventId);
            return;
        }
        await error_handler(eventId);
        throw new Error("User is not checked in.");
    } catch(error) {
        throw new Error('Error during check-out: ' + error.message);
    }
}

module.exports = {
    checkIn,
    checkOut,

};