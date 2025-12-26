const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authValidation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    } 
    next();
}

const existing_user = async (id) => {
    const user = await User.findById(id);
    if(!user){
        throw new Error('User does not exist');
    }
}

const authorizer = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token) 
            throw new Error('No token found');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.id = decoded.id;
        await existing_user(decoded.id);
        next();
    } catch(error) {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

module.exports = {
    authValidation,
    authorizer
};