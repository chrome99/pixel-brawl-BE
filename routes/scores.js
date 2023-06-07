const express = require('express');
const { passworMatch, isNewUser, encryptPwd, doesUserExist, requireAdmin, auth} = require("../middlewares/userMiddlewares");
const router = express.Router();

const ScoresController = require('../controllers/scores');

// GET ALL
router.get("/", ScoresController.getAllScores);

// GET 
router.get("/user", ScoresController.getScoresByUser);

// CREATE
router.post('/', ScoresController.postScore);

module.exports = router