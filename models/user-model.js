const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  oauth: {
    username: String,
    authId: String,
  },
  local: {
    email: String,
    username: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
