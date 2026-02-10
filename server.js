import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public")); // serves index.html

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Study route
app.post("/study", async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study tutor. Explain the topic simply and give 3 quiz questions with answers.",
        },
        {
          role: "user",
          content: `Topic: ${topic}`,
        },
      ],
    });

    const result = response.choices[0].message.content;

    res.json({ result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

