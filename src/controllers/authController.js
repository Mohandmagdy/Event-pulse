const { sign } = require('jsonwebtoken');
const authService = require('../services/authService');
const cookieParser = require('cookie-parser');

const signup = async (req, res) => {
    const user = req.body;
    try {
        const { token } = await authService.handleSignup(user);
        res.cookie('jwt', token, { httpOnly: true , maxAge: 24 * 60 * 60 * 1000});
        console.log("User signed up and JWT cookie set.");
        res.status(201).json({message: 'User registered successfully. '});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const { token } = await authService.handle_login(email, password);
        res.cookie('jwt', token, { httpOnly: true , maxAge: 24 * 60 * 60 * 1000});
        res.status(200).json({message: 'Login successful'});
    } catch(error) {
        res.status(401).json({error: 'Invalid email or password'});
    }
}


module.exports = { 
    signup,
    login
};