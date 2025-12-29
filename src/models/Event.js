const mongoose = require('mongoose');
const { create } = require('./User');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter an event title'],
    },
    description: {
        type: String,
        required: [true, 'Please enter an event description'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please enter a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please enter an end date'],
    },
    location: {
        type: String,
        required: [true, 'Please enter an event location'], 
    },
    price: {Number},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event must have a creator']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;