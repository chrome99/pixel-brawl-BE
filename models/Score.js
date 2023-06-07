const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    player1: { type: String, required: true, maxLength: 20 },
    player1Score: { type: Number, required: true },
    player2: { type: String, required: true, maxLength: 20 },
    player2Score: { type: Number, required: true },
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoreSchema);
module.exports = { Score };
