const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/google_config');
const redisClient = require('./config/redis_config');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { authorizer } = require('./middlewares/authVaildation');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

//connect to mongo db
const mongo_host = 'mongo';
const mongo_port = 27017;
const mongo_username = process.env.MONGO_USER;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_dbname = 'event_pulse';
const mongo_URI = `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:${mongo_port}/${mongo_dbname}?authSource=admin`;
const mongo_connect = async () => {
    try {
        await mongoose.connect(mongo_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
mongo_connect();

//connect to redis
redisClient.connect()
    .then(() => console.log('Redis client connected'))
    .catch((err) => console.error('Error connecting to Redis:', err));

//middlewares
app.use(express.json());
app.use(passport.initialize());


//routes
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use(authorizer);
app.use('/event', eventRoutes);
app.use('/booking', bookingRoutes);


//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});