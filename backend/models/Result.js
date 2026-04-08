const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number,
      required: true
    },
    rawWpm: {
      type: Number
    },
    charactersTyped: {
      type: Number
    },
    weakKeys: {
      type: Map,
      of: Number,
      default: {}
    },
    wpmHistory: [
      {
        time: Number,
        wpm: Number
      }
    ],
    mode: {
      type: String,
      default: "time"
    },
    difficulty: {
      type: String,
      default: "medium"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Result", resultSchema);