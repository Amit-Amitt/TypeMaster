const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// SEARCH USERS
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    // Case-insensitive search on name
    const users = await User.find({
      name: { $regex: query, $options: "i" }
    })
      .select("name email level xp avatar bestWpm avgAccuracy")
      .limit(10);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Search Users Error:", error);
    res.status(500).json({ success: false, message: "Server error during search" });
  }
});

// GET USER BY ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// UPDATE CURRENT USER PROFILE
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (bio !== undefined) user.bio = bio;
    await user.save();

    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
