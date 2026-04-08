const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    wpm: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    mistakes: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number,
      default: 60
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);