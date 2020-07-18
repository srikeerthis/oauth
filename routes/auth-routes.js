const passport = require("passport");

const router = require("express").Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  })
);

router.get("/logout", (req, res) => {
  res.send("logged out");
});

router.get("/github/cb", passport.authenticate("github"), (req, res) => {
  res.send(req.user);
});

module.exports = router;
