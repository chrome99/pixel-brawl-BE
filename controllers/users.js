const { User } = require("../models/User");
const jwt = require("jsonwebtoken");

async function getAll(req, res, next) {
  const allUsers = await User.find();
  res.send(allUsers);
}

async function signup(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const newUserWithoutRepeatedPwd = {
      username,
      email,
      password,
    };

    const user = await User.addUser(newUserWithoutRepeatedPwd, next);
    if (user) {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {
        maxAge: 100000 * 20 * 60,
        httpOnly: true,
      });
      res.status(201).send(user);
    }
  } catch (err) {
    next(err);
  }
}



async function login(req, res, next) {
  try {
    const { password, user } = req.body;
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        next(err);
      }
      if (!result) {
        next(err);
      }
      if (result) {
        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.cookie("token", token, {
          maxAge: 100000 * 20 * 60,
          httpOnly: true,
        });
        res.send(user);
      }
    });
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  try {
    res.clearCookie("token", { httpOnly: true });
    res.send(true);
  } catch (err) {
    next(err);
  }
}

async function getVerifiedUser(req, res, next) {
  const userId = req.userId;

  try {
    const user = await User.getUserById(userId, next);
    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, signup, login, getVerifiedUser, logout };
