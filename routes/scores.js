const express = require('express');
const router = express.Router();

const ScoresController = require('../controllers/scores');

// GET ALL
router.get("/", ScoresController.getAllScores);

// GET 
router.get("/user", ScoresController.getScoresByUser);

// CREATE
router.post('/', ScoresController.postScore);

module.exports = router