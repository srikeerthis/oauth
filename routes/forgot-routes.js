const router = require("express").Router();
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const async = require("async");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const keys = require("../config/keys");

router.get("/forgot", function (req, res) {
  res.render("forgot", {
    user: req.user,
  });
});

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
  auth: {
    api_key: keys.mailgun.apikey,
    domain: keys.mailgun.domain,
  },
};

router.post("/forgot", (req, res) => {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ "local.email": req.body.email }, function (err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            console.log("Wrong username");
            return res.redirect("/auth/forgot");
          }
          console.log("updating key");
          user.local.resetPasswordToken = token;
          user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        const nodemailerMailgun = nodemailer.createTransport(mg(auth));
        var mailOptions = {
          from: keys.email.id,
          to: user.local.email,
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/auth/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        nodemailerMailgun.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);
          req.flash(
            "info",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          console.log("reset mail sent");
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) console.log(err);
      res.redirect("/auth/forgot");
    }
  );
});

router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      "local.resetPasswordToken": req.params.token,
      "local.resetPasswordExpires": { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        console.log("password reset toke expired");
        return res.redirect("/auth/forgot");
      }
      res.render("reset", {
        user: req.user,
        param: req.params,
      });
    }
  );
});

router.post("/reset/:token", function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            "local.resetPasswordToken": req.params.token,
            "local.resetPasswordExpires": { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              console.log("password token invalid");
              return res.redirect("/auth/forgot");
            }
            console.log("updating password");
            user.local.password = generateHash(req.body.password);
            user.local.resetPasswordToken = undefined;
            user.local.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) console.log(err);
              req.logIn(user, function (err) {
                if (err) console.log(err);
                done(err, user);
              });
            });
          }
        );
      },
      function (user, done) {
        const nodemailerMailgun = nodemailer.createTransport(mg(auth));
        var mailOptions = {
          from: keys.email.id,
          to: user.local.email,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.local.email +
            " has just been changed.\n",
        };
        nodemailerMailgun.sendMail(mailOptions, function (err, info) {
          req.flash("success", "Success! Your password has been changed.");
          console.log(info, "success");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/profile/");
    }
  );
});

var generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = router;
