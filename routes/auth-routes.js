const passport = require("passport");

const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  })
);

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.get("/github/cb", passport.authenticate("github"), (req, res) => {
  res.redirect("/profile/");
});

module.exports = router;
