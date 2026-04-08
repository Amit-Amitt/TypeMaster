const express = require("express");
const Result = require("../models/Result");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// SAVE RESULT (protected)
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { speed, accuracy, timeTaken, rawWpm, charactersTyped, weakKeys, wpmHistory, mode, difficulty } = req.body;

    if (!speed || !accuracy || !timeTaken) {
      return res.status(400).json({ message: "All result fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Save the result
    const newResult = new Result({
      userId: user._id,
      name: user.name,
      speed,
      accuracy,
      timeTaken,
      rawWpm,
      charactersTyped,
      weakKeys,
      wpmHistory,
      mode,
      difficulty
    });
    await newResult.save();

    // 2. Calculate XP
    const difficultyMultiplier = { easy: 1, medium: 1.2, hard: 1.5 }[difficulty] || 1;
    const gainedXp = Math.floor((speed * (accuracy / 100)) * (timeTaken / 10) * difficultyMultiplier);
    
    user.xp += gainedXp;
    
    // 3. Level Up Logic (1000 XP per level)
    const newLevel = Math.floor(user.xp / 1000) + 1;
    let leveledUp = false;
    if (newLevel > user.level) {
      user.level = newLevel;
      leveledUp = true;
    }

    // 4. Update User Stats
    user.totalTests += 1;
    if (speed > user.bestWpm) user.bestWpm = speed;
    
    // Weighted average for accuracy
    user.avgAccuracy = Math.round(((user.avgAccuracy * (user.totalTests - 1)) + accuracy) / user.totalTests);

    // 5. Streak Logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastTest = user.lastTestDate ? new Date(user.lastTestDate).setHours(0, 0, 0, 0) : null;
    
    if (!lastTest) {
      user.streak = 1;
    } else {
      const diffTime = Math.abs(today - lastTest);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    }
    user.lastTestDate = new Date();

    // 6. Achievement Checking
    const newAchievements = [];
    const existingIds = user.achievements.map(a => a.id);

    const checkAndAdd = (id, title, description) => {
      if (!existingIds.includes(id)) {
        const ach = { id, title, description, unlockedAt: new Date() };
        user.achievements.push(ach);
        newAchievements.push(ach);
      }
    };

    if (speed >= 50) checkAndAdd("wpm_50", "Speed Demon", "Hit 50 WPM for the first time!");
    if (speed >= 80) checkAndAdd("wpm_80", "Velocity King", "Hit 80 WPM for the first time!");
    if (speed >= 100) checkAndAdd("wpm_100", "Supersonic", "Reached the elite 100 WPM milestone!");
    if (accuracy === 100) checkAndAdd("acc_100", "Perfect Aim", "Finished a test with 100% accuracy!");
    if (user.streak >= 3) checkAndAdd("streak_3", "Consistent", "Maintained a 3-day typing streak!");

    await user.save();

    res.status(201).json({ 
      message: "Result saved successfully", 
      result: newResult,
      updates: {
        gainedXp,
        leveledUp,
        currentLevel: user.level,
        currentXp: user.xp,
        newAchievements
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving result", error: error.message });
  }
});

// GET MY RESULTS (protected)
router.get("/my-results", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
});

// GET RESULTS FOR SPECIFIC USER (protected)
router.get("/user-results/:userId", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error: error.message });
  }
});

// LEADERBOARD (public)
router.get("/leaderboard", async (req, res) => {
  try {
    const { filter } = req.query; // 'weekly' or 'all-time'
    let dateLimit = new Date(0); // Default to all-time
    
    if (filter === "weekly") {
      dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 7);
    }

    const leaderboard = await Result.aggregate([
      { $match: { createdAt: { $gte: dateLimit } } },
      { $sort: { speed: -1, accuracy: -1 } },
      {
        $group: {
          _id: "$userId",
          bestSpeed: { $first: "$speed" },
          bestAccuracy: { $first: "$accuracy" },
          name: { $first: "$name" },
          createdAt: { $first: "$createdAt" }
        }
      },
      { $sort: { bestSpeed: -1, bestAccuracy: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 1,
          speed: "$bestSpeed",
          accuracy: "$bestAccuracy",
          name: 1,
          createdAt: 1
        }
      }
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard", error: error.message });
  }
});

module.exports = router;