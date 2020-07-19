// router instance
const router = require("express").Router();

//middleware to check login status
const authCheck = (req, res, next) => {
  if (!req.user) {
    //user not logged in
    res.redirect("/auth/login");
  } else {
    //user logged in
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
