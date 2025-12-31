const bookingService = require('../services/bookingService');

const checkIn = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user_id;
    try{
        await bookingService.checkIn(eventId, userId);
        res.sendStatus(200);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

const checkOut = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user_id;
    try{
        await bookingService.checkOut(eventId, userId);
        res.sendStatus(200);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    checkIn,
    checkOut,

};  