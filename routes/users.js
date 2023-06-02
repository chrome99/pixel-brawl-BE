const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

//get all users
router.get("/", UsersController.getAll);