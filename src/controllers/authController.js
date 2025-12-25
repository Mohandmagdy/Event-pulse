const express = require('express');
const authService = require('../services/authService');

const handleSignup = (req, res) => {
    const user = req.body;
    try {
        authService.handleSignup(user);
        res.status(201).json({message: 'User registered successfully. '});
    } catch(error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
}


module.exports = { 
    handleSignup,

};