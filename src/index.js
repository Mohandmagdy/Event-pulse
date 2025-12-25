const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

//connect to mongo db
const mongo_host = 'mongo';
const mongo_port = 27017;
const mongo_username = process.env.MONGO_USER;
const mongo_password = process.env.MONGO_PASSWORD;
const mongo_dbname = 'event_pulse';
const URI = `mongodb://${mongo_username}:${mongo_password}@${mongo_host}:${mongo_port}/${mongo_dbname}?authSource=admin`;
const mongo_connect = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}
mongo_connect();

//middlewares
app.use(express.json());


//routes
app.use('/auth', authRoutes);


//start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});