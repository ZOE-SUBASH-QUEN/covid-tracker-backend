const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
  email: String,
  tracking: [String],
});



module.exports = mongoose.model("user", UserSchema);