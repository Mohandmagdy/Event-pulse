var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        const email = profile.emails[0].value;

        let user = await User.findOne({ googleId: profile.id });
        if(user) {
            return cb(null, user);
        }

        user = await User.findOne({ email });
        if(user) {
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
            return cb(null, user);
        }

        const newUser = new User({
            googleId: profile.id,
            email: email,
            username: profile.displayName,
            isVerified: true
        })
        await newUser.save();
        return cb(null, newUser);
    }
));
