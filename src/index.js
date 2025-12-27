const express = require('express');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const authRoutes = require('./routes/authRoutes');
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
const redis_host = 'redis';
const redis_port = 6379;
const redis_URI = `redis://${redis_host}:${redis_port}`;
const redisClient = createClient({ url: redis_URI });
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('Redis client connected'));
console.log('Connected to Redis');

//middlewares
app.use(express.json());

//routes
app.use(cookieParser());
app.use(authorizer);
app.use('/auth', authRoutes);


//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});