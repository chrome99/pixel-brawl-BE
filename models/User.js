const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, maxLength: 20 },
    password: { type: String, required: true, maxLength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Invalid email address",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.statics.getAllUsers = async function (next) {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    next(error);
  }
};

userSchema.statics.getUserByEmail = async function (email, next) {
  try {
    const user = await this.findOne({ email });
    return user;
  } catch (error) {
    next(error);
  }
};

userSchema.statics.getUserById = async function (id, next) {
  try {
    const user = await this.findById(id);
    return user;
  } catch (error) {
    next(databaseError());
  }
};

userSchema.statics.addUser = async function (user, next) {
  try {
    const newUser = await this.create(user);
    return newUser;
  } catch (error) {
    next(error);
  }
};

userSchema.statics.deleteUser = async function (userId, next) {
  try {
    const newUser = await this.findByIdAndDelete(userId);
    return newUser;
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
