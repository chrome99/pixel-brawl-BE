const { User } = require("../models/User");


async function getAll(req, res, next) {
  const allUsers = await User.find();
  res.status(200).send(allUsers);
}

async function signup(req, res, next) {
  try {
    const { username , email, password } = req.body;

    const newUserWithoutRepeatedPwd = {
      username,
      email,
      password
    };

    const userId = await User.addUser(newUserWithoutRepeatedPwd, next);
    if (userId) {
      res.ok(userId);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll };
