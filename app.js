const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const flash = require("connect-flash");

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

// use css
app.use(express.static(__dirname + "/public"));
//middleware to readurl
app.use(express.urlencoded({ extended: true }));

// connect to mongodb
mongoose.connect(
  keys.mongodb.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
    // listen for requests after conncection to db
    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  }
);

//set up routes
app.use(flash());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//create homepage
app.get("/", (req, res) => {
  //send object to check status and display content
  res.render("home", { user: req.user });
});
