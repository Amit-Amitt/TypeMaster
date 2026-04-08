const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      type: Number,
      default: 0
    },
    lastTestDate: {
      type: Date
    },
    achievements: [
      {
        id: String,
        title: String,
        description: String,
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    avatar: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    bestWpm: {
      type: Number,
      default: 0
    },
    avgAccuracy: {
      type: Number,
      default: 0
    },
    totalTests: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);