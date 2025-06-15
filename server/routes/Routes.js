const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/generate-idea", async (req, res) => {
  const { topic, niche } = req.body;

  const prompt = `
You are a content strategist. Suggest one trending Instagram reel idea for a creator in the ${niche} niche based on the topic "${topic}".
Include:
- A short reel idea
- An Instagram caption
- 5 relevant hashtags
- A strong hook line.
Format your answer like:
**Reel Idea:** ...
**Caption:** ...
**Hashtags:** ...
**Hook Line:** ...
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const ideaMatch = content.match(/\*\*Reel Idea:\*\*\s*(.*)/i);
    const captionMatch = content.match(/\*\*Caption:\*\*\s*(.*)/i);
    const hashtagsMatch = content.match(/\*\*Hashtags:\*\*\s*(.*)/i);
    const hookMatch = content.match(/\*\*Hook Line:\*\*\s*(.*)/i);

    const idea = ideaMatch?.[1]?.trim() || "";
    let caption = captionMatch?.[1]?.trim() || "";
    caption = caption.replace(/#\w+/g, "").trim();
    const hook = hookMatch?.[1]?.trim() || "";
    
    const hashtags = hashtagsMatch?.[1]
      ?.split(/[#*•,\s]+/)
      .filter(tag => tag && tag.length > 0)
      .map(tag => `#${tag.trim().replace(/^\#/, "")}`) || [];

    res.json({
      idea,
      caption,
      hook,
      hashtags,
    });
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate content idea." });
  }
});

module.exports = router;
