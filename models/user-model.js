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

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password, user) {
  return bcrypt.compareSync(password, user.local.password);
};

const User = mongoose.model("users", userSchema);

module.exports = User;
