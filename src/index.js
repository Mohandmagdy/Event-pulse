const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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


app.get('/', (req, res) => {
  res.send('<h1>Welcome to Event Pulse</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});