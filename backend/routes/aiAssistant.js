const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const SYSTEM_PROMPT = `
You are "Haqdar Sahayak", a compassionate and clear AI assistant built for informal and daily-wage workers.
Your mission:
1. Help workers understand their shift records, daily wages, and approved vs. pending payments.
2. Explain how proof verification works in simple everyday terms.
3. Guide workers calmly on dispute resolution if their wages are delayed or mismatched.
4. If the worker asks in Hindi or Hinglish, answer in simple, polite Hindi/Hinglish.
5. Keep responses short and practical (under 3-4 sentences).
`;

router.post("/chat", async (req, res) => {
  try {
    const { message, workerData } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in process.env!");
      return res.status(500).json({ 
        success: false, 
        error: "API key not configured in backend." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const context = workerData
      ? `Worker Summary: Name: ${workerData.name || "Worker"}, Shifts: ${workerData.totalShifts || 0}, Pending: ₹${workerData.pendingWages || 0}`
      : "No worker session context attached.";

    const prompt = `${SYSTEM_PROMPT}\n\n[Worker Context]: ${context}\n\n[Worker Question]: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.error("Haqdar Sahayak Error Details:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Sahayak is currently resting. Please try again shortly.",
    });
  }
});

module.exports = router;