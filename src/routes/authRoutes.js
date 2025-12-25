const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { signupValidation } = require('../validators/authValidation');
const { authValidation } = require('../middlewares/authVaildation');


router.post('/signup', signupValidation, authValidation, authController.handleSignup);
router.get('/verify-email')


module.exports = router;