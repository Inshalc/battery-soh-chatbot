import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /ask-battery
router.post("/", async (req, res) => {
  const { question, soh, status } = req.body;
  try {
    const systemPrompt = `You are a friendly assistant that gives concise, accurate battery advice. If SOH info is provided, consider it.`;
    const userContent = soh !== undefined
      ? `Battery SOH: ${soh}. Status: ${status}. User question: ${question}`
      : question;

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
        ],
        max_tokens: 400
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const reply = openaiRes.data.choices?.[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (err) {
    console.error("chatbot route error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Chatbot request failed", details: err.response?.data || err.message });
  }
});

export default router;
