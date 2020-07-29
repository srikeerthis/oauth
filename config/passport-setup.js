const passport = require("passport");
const githubStrategy = require("passport-github");
const googleStrategy = require("passport-google-oauth20");
const twitterStrategy = require("passport-twitter");
const facebookStrategy = require("passport-facebook");
const localStrategy = require("passport-local");

const bcrypt = require("bcrypt");
const keys = require("./keys");
const User = require("../models/user-model");

passport.use(
  new githubStrategy(
    {
      //option for github stratergy
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: "/auth/github/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ "oauth.authId": profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            "oauth.username": profile.displayName,
            "oauth.authId": profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("user data created");
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new googleStrategy(
    {
      //option for github stratergy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ "oauth.authId": profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            "oauth.username": profile.displayName,
            "oauth.authId": profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("user data created");
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new twitterStrategy(
    {
      //option for github stratergy
      consumerKey: keys.twitter.consumerKey,
      consumerSecret: keys.twitter.consumerSecret,
      callbackURL: "/auth/twitter/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ "oauth.authId": profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            "oauth.username": profile.displayName,
            "oauth.authId": profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("user data created");
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new facebookStrategy(
    {
      //option for github stratergy
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: "/auth/facebook/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ "oauth.authId": profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            "oauth.username": profile.displayName,
            "oauth.authId": profile.id,
          })
            .save()
            .then((newUser) => {
              console.log("user data created");
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  "signup",
  new localStrategy(
    {
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    (req, username, password, done) => {
      User.findOne({ "local.username": username }, function (err, user) {
        if (err) return done(err);

        // check to see if theres already a user with that email
        if (user) {
          return done(
            null,
            false,
            req.flash("signupMessage", "That email is already taken.")
          );
        } else {
          // create the user
          var newUser = new User({
            // set the user's local credentials
            "local.email": req.body.email,
            "local.username": username,
            "local.password": newUser.generateHash(password),
          });

          // save the user
          newUser.save(function (err) {
            if (err) throw err;
            console.log("account created");
            return done(null, newUser);
          });
        }
      });
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    (req, username, password, done) => {
      User.findOne({ "local.username": username }, function (err, user) {
        if (err) return done(err);
        // check to see if theres already a user with that email
        if (!user) {
          return done(null, false, req.flash("loginMessage", "No user found"));
        }
        if (!user.validPassword(password, user))
          return done(
            null,
            false,
            req.flash("loginMessage", "Oops! Wrong password.")
          ); // create the loginMessage and save it to session as flashdata

        // all is well, return successful user
        return done(null, user);
      });
    }
  )
);

// var generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// var validPassword = function (password, user) {
//   return bcrypt.compareSync(password, user.local.password);
// };

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
