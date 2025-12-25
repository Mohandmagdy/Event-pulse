const express = require('express');
const User = require('../models/User');

const handleSignup = (user) => {
    const newUser = new User(user);
    return newUser.save();
}