const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  topic: String,
  niche: String,
  idea: String,
  caption: String,
  hook: String,
  hashtags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Idea", ideaSchema);
