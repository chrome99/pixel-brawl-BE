const { Score } = require("../models/Score");

async function getAllScores (req, res) {
  try {
    const scores = await this.find();
    res.status(200).send(scores);
  } catch (error) {
    res.status(500).send(error);
  }
};

async function postScore (req, res) {
  try {
    const {player1, player2, player1Score, player2Score} = req.body;

    if (!(player1 && player2 && player1Score && player2Score)) {
        return res.status(400).send("All input is required");
    }

    const newScore = new Score(req.body);
    const savedScore = await newScore.save()
    res.status(200).send(savedScore);
  } catch (error) {
    res.status(500).send(error);
  }
};

async function getScoresByUser (req, res) {
  try {
    const { username } = req.query;
    const user = await this.find({
      $or: [
        { player1: username },
        { player2: username }
      ]
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getAllScores, postScore, getScoresByUser };
