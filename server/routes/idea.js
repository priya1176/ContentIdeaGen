const express = require("express");
const Idea = require("../models/Idea");

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const savedIdea = await Idea.create(req.body);
    res.status(201).json(savedIdea);
  } catch (error) {
    console.error("Error saving idea:", error);
    res.status(500).json({ message: "Failed to save idea", error });
  }
});

module.exports = router; 
