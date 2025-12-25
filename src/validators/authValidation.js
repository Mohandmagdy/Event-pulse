const {body} = require('express-validator');

const signupValidation = [
    body('username')
        .notEmpty().withMessage('Username is required'),
    body('email')
        .isEmail().withMessage('Please enter a valid email'),
    body('password')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters long')
];

module.exports = {
    signupValidation,
};