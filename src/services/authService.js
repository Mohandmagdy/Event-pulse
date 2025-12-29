const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../config/redis_config');
const transporter = require('../config/nodemailer_config');

const error_handler = (err) => {
    if(err.code === 11000){
        return 'Email already registered';
    }
}

const sendMail = async (email, otp) => {
    await transporter.sendMail({
        from: '"Liliana Schowalter" <liliana86@ethereal.email>',
        to: email,
        subject: "Email Verification",
        text: `Your otp code is ${otp}, the code will expire in 5 minutes.`,
    });
}

const create_jwt_token = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

const handleSignup = async (user) => {
    try {
        const newUser = new User(user);
        const newUserSaved = await newUser.save();
        const token = create_jwt_token(newUserSaved._id);
        return {token};
    } catch(error) {
        error.message = error_handler(error) || error.message;
        throw new Error(error.message);
    }
    
}

const handle_login = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('email address is not correct');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
        throw new Error('password is not correct');
    }
    const token = create_jwt_token(user._id);
    return {token};
}

const send_otp = async (user_id) => {
    try {
        const user = await User.findById(user_id);
        const otp = crypto.randomInt(100000, 999999);
        await sendMail(user.email, otp);
        await redisClient.set(`otp_${user_id}`, otp, {EX: 300}); 
    } catch (error) {
        throw new Error('Error sending OTP');
    }
}

const verify_otp = async (user_id, otp) => {
    const stored_otp = await redisClient.get(`otp_${user_id}`);
    if(stored_otp !== otp) {
        throw new Error('Invalid OTP');
    } else {
        await User.findByIdAndUpdate(user_id, {isVerified: true});
        await redisClient.del(`otp_${user_id}`);
    }
}

const forgot_password = async (email) => {
    try {
        const otp = crypto.randomInt(100000, 999999);
        await sendMail(email, otp);
        await redisClient.set(`otp_${email}`, otp, {EX: 300}); 
    } catch (error) {
        throw new Error('Error sending OTP');
    }
}

const verify_forgot_password_otp = async (email, otp, new_password) => {
    try {
        const stored_otp = await redisClient.get(`otp_${email}`);
        if(stored_otp !== otp) {
            throw new Error('Invalid OTP');
        } else {
            const user = await User.findOne({email});
            user.password = new_password;
            await user.save();
            await redisClient.del(`otp_${email}`);
        }
    } catch(error) {
        throw new Error(error.message);
    }
}

const passport_authenticate_google_callback = (id, res) => {
    try {
        const token = create_jwt_token(id);
        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000 
        });
    } catch(error) {
        throw new Error("Error during Google OAuth");
    }
    
}

module.exports = {
    handleSignup,
    handle_login,  
    send_otp,
    verify_otp,
    forgot_password,
    verify_forgot_password_otp,
    create_jwt_token,
    passport_authenticate_google_callback,

}