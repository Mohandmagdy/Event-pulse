const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email'
        }
    }, 
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],    
        minlength: [6, 'Minimum password length is 6 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;