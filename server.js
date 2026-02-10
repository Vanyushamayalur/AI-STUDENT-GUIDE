import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API route
app.post("/study", async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study tutor. Explain simply and give 3 quiz questions with answers.",
        },
        {
          role: "user",
          content: `Topic: ${topic}`,
        },
      ],
    });

    res.json({
      result: response.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
});

// Frontend in same file
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Study Partner</title>
      <style>
        body {
          font-family: Arial;
          max-width: 800px;
          margin: auto;
          padding: 20px;
          background: #f5f5f5;
        }
        h1 {
          text-align: center;
        }
        input {
          width: 70%;
          padding: 10px;
          font-size: 16px;
        }
        button {
          padding: 10px 15px;
          font-size: 16px;
          cursor: pointer;
        }
        .card {
          background: white;
          padding: 20px;
          margin-top: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <h1>AI Study Partner</h1>

      <input id="topic" placeholder="Enter topic (e.g. Binary Search)" />
      <button onclick="study()">Study</button>

      <div class="card" id="output"></div>

      <script>
        async function study() {
          const topic = document.getElementById("topic").value;

          document.getElementById("output").innerText = "Loading...";

          const res = await fetch("/study", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic }),
          });

          const data = await res.json();
          document.getElementById("output").innerText = data.result;
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

