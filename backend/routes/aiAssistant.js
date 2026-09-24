const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const SYSTEM_PROMPT = `
You are "Haqdar Sahayak", an empathetic, precise AI assistant designed for informal and daily-wage laborers.
Your guidelines:
1. When asked about earnings, shifts, or employers, directly quote the exact numbers and names provided in [Worker Context].
2. If the user asks in Hindi or Hinglish, answer in simple, warm Hindi or Hinglish. If in English, answer in clear English.
3. Keep answers concise, factual, and reassuring (maximum 2 to 3 sentences).
4. Never invent numbers or employers outside of [Worker Context]. If no worker context is present, politely ask the worker to choose their name from the passbook list.
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

    // Build context dynamically from whichever worker is currently passed
    const context = workerData && workerData.name
      ? `Worker Profile:
- Name: ${workerData.name}
- Phone: ${workerData.phone || "Not provided"}
- Confirmed Days / Shifts: ${workerData.confirmedDays ?? workerData.totalShifts ?? 0} दिन
- Total Verified Earnings: ₹${workerData.totalEarned ?? 0}
- Pending / Unconfirmed Wages: ₹${workerData.pendingWages ?? 0}
- Associated Employer(s): ${workerData.employers || workerData.employer || "Not registered yet"}
- Cryptographic Proof Status: ${workerData.isChainIntact ? "SHA-256 Intact (Verified)" : "Tampered / Incomplete"}`
      : "No worker selected yet. Prompt the user to select their name from the passbook dropdown.";

    const prompt = `${SYSTEM_PROMPT}\n\n[Worker Context]:\n${context}\n\n[Worker Question]: "${message}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const replyText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      `नमस्ते ${workerData?.name || ''}, आपकी कुल सत्यापित कमाई ₹${workerData?.totalEarned || 0} है।`;

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    console.error("Haqdar Sahayak Error Details:", error);
    return res.status(500).json({
      success: false,
      reply: "माफ़ करें, अभी सर्वर से संपर्क नहीं हो पा रहा है। कृपया दोबारा प्रयास करें।",
      error: error.message,
    });
  }
});

module.exports = router;