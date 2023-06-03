const express = require('express');
const { passworMatch, isNewUser, encryptPwd, doesUserExist, requireAdmin, auth} = require("../middlewares/userMiddlewares");
const router = express.Router();

const UsersController = require('../controllers/users');

// GET ALL
router.get("/", UsersController.getAll);

// CREATE
router.post('/signup', passworMatch, isNewUser, encryptPwd, UsersController.signup);

//LOGIN
router.post('/login', doesUserExist, UsersController.login);

//LOGOUT
router.get('/logout', auth, UsersController.logout);

//verify user
router.get('/verify', auth, UsersController.getVerifiedUser);

module.exports = router