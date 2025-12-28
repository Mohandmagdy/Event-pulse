const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { signupValidation } = require('../validators/authValidation');
const { authValidation, authorizer } = require('../middlewares/authVaildation');
const passport = require('passport');

//normal login and signup routes
router.post('/signup', signupValidation, authValidation, authController.signup);
router.post('/login', authController.login);
router.get('/verify-email', authorizer, authController.verifyEmail);
router.post('/verify-email', authorizer, authController.verify_otp);
router.post('/forgot-password', authController.forgot_password);
router.post('/confirm-password-reset', authController.confirm_password_reset);

//OAuth with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    authController.passport_authenticate_google_callback);


module.exports = router;