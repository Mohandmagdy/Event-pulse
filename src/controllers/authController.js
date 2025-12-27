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

const verifyEmail = (req, res) => {
    authService.send_otp(req.user_id);
    res.status(200).json({message: 'OTP sent to email'});
}

const verify_otp = async (req, res) => {
    const { otp } = req.body;
    try {
        await authService.verify_otp(req.user_id, otp);
        res.status(200).json({message: 'Email verified successfully'});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

const forgot_password = (req, res) => {
    try{
        const { email } = req.body;
        authService.forgot_password(email);
        res.status(200).json({message: 'OTP sent to email'});
    } catch(error) {
        res.status(500).json({error: error.message});
    }
    
}

const confirm_password_reset = async (req, res) => {
    const { email, otp, new_password } = req.body;
    try {
        await authService.verify_forgot_password_otp(email, otp, new_password);
        res.status(200).json({message: 'Password reset successful'});
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = { 
    signup,
    login,
    verifyEmail,
    verify_otp,
    forgot_password,
    confirm_password_reset,

};