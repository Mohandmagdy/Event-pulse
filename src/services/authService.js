const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const error_handler = (err) => {
    if(err.code === 11000){
        return 'Email already registered';
    }
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

module.exports = {
    handleSignup,
    handle_login
}