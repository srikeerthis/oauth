const passport = require("passport");
const githubStatergy = require("passport-github");
const googleStatergy = require("passport-google-oauth20");
const twitterStatergy = require("passport-twitter");

const keys = require("./keys");
const User = require("../models/user-model");

passport.use(
  new githubStatergy(
    {
      //option for github stratergy
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: "/auth/github/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ oauthId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            oauthId: profile.id,
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
  new googleStatergy(
    {
      //option for github stratergy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ oauthId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            oauthId: profile.id,
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
  new twitterStatergy(
    {
      //option for github stratergy
      clientID: keys.twitter.clientID,
      clientSecret: keys.twitter.clientSecret,
      callbackURL: "/auth/twitter/cb",
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user exists
      User.findOne({ oauthId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            oauthId: profile.id,
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
