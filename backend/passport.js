const GOOGLE_CLIENT_ID = "806225457345-dlv6oecjp4db580q4oo8dj0ln8sgte6o.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const localStrategy = require("passport-local")
const passport = require("passport")
const User = require('./models/user')

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:5000/auth/google/callback"
    callbackURL: "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      const user = await User.findOne({email: profile.emails[0].value});
      if(user){
        return cb(null, user);
      } else {
        const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value
        });
        return cb(null, newUser);
      }
    } catch (err) {
      return cb(err, null);
    }
  }
));

//Telling passport to use authenticate method on UserSchema
passport.use(new localStrategy({
  usernameField: 'email'
}, User.authenticate()));

//Serialization means how do we store user in the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  