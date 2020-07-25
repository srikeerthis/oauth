const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  oauth: {
    username: String,
    authId: String,
  },
  local: {
    username: String,
    password: String,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
