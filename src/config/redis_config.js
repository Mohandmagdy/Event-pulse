const { createClient } = require('redis');

const redis_host = 'redis';
const redis_port = 6379;
const redis_URI = `redis://${redis_host}:${redis_port}`;
const redisClient = createClient({ url: redis_URI });
redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;