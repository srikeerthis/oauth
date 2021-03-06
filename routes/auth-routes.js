const passport = require("passport");

const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("login", { user: req.user, message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/profile/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

router.get("/signup", (req, res) => {
  res.render("signup",{message: req.flash("signupMessage")});
});

router.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/profile/",
    failureRedirect: "/auth/signup",
    failureFlash: true,
  })
);

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/twitter",
  passport.authenticate("twitter", {
    scope: ["profile"],
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["profile"],
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/github/cb", passport.authenticate("github"), (req, res) => {
  res.redirect("/profile/");
});

router.get("/google/cb", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/");
});

router.get("/twitter/cb", passport.authenticate("twitter"), (req, res) => {
  res.redirect("/profile/");
});

router.get("/facebook/cb", passport.authenticate("facebook"), (req, res) => {
  res.redirect("/profile/");
});

module.exports = router;
