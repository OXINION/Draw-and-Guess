const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const cfv = require('./configVars');
// Load user model
const User = mongoose.model('users');

module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: cfv.googleClientID,
      clientSecret:cfv.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {

      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
      }

      // Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}