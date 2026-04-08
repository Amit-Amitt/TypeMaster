const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const authMiddleware = require("../middleware/authMiddleware");

// SAVE SCORE
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { name, email, wpm, accuracy, mistakes, timeTaken } = req.body;

    const newScore = new Score({
      userId: req.user.id,
      name,
      email,
      wpm,
      accuracy,
      mistakes,
      timeTaken
    });

    await newScore.save();

    res.status(201).json({
      success: true,
      message: "Result saved successfully",
      data: newScore
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving result"
    });
  }
});

// GET LEADERBOARD
router.get("/leaderboard", async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ wpm: -1, accuracy: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching leaderboard"
    });
  }
});

module.exports = router;