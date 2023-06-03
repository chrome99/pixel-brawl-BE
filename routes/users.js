const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

// GET ALL
router.get("/", UsersController.getAll);

// CREATE
router.post('/signup', passworMatch, isNewUser, encryptPwd, UserControllers.signup);

//LOGIN
router.post('/login', doesUserExist, UserControllers.login);

//LOGOUT
router.get('/logout', auth, UserControllers.logout);

module.exports = router