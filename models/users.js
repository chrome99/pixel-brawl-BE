const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, maxLength: 20},
    password: {type: String, required: true, maxLength: 50},
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = {User};