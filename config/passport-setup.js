const passport = require("passport");
const githubStatergy = require("passport-github");
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
      User.findOne({ githubId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            githubId: profile.id,
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
