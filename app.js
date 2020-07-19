const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

const app = express();

//create view engine

app.set("view engine", "ejs");

//setup cookie with encryption
app.use(
  cookieSession({
    //time of one day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.mongoURI, () => {
  console.log("connected to db");
});

//set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//create homepage

app.get("/", (req, res) => {
  //send object to check status and display content
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
