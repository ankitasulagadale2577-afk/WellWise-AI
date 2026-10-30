// ==============================================================================
// WellWise AI — Secure Backend Server
// Handles AI assistant requests, emergency detection, and keeps private keys secure
// ==============================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50kb" }));

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "severe bleeding",
  "heavy bleeding",
  "stroke",
  "facial drooping",
  "unconscious",
  "poisoning",
  "seizure",
  "choking"
];

function isMedicalEmergency(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

const LANGUAGE_MAP = {
  en: "English",
  mr: "Marathi (मराठी)",
  hi: "Hindi (हिन्दी)",
  kn: "Kannada (ಕನ್ನಡ)",
};

app.get("/api/health", (_req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  res.json({
    status: "ok",
    service: "WellWise AI Secure Server",
    aiConfigured: Boolean(geminiKey || openaiKey),
    provider: geminiKey ? "gemini" : (openaiKey ? "openai" : "none")
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language = "en" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const latestMessage = messages[messages.length - 1];
    const userText = latestMessage?.content || latestMessage?.text || "";

    if (userText.length > 2000) {
      return res.status(400).json({ error: "Message exceeds 2000 characters limit." });
    }

    const emergency = isMedicalEmergency(userText);
    const targetLanguage = LANGUAGE_MAP[language] || "English";

    const systemPrompt = `You are WellWise AI, an empathetic, evidence-based healthcare educational assistant for India.
Primary Language: You MUST reply fluently in ${targetLanguage}.
Essential Rules:
1. Provide clear, supportive, and scientifically grounded general health education.
2. DO NOT provide a definitive diagnosis or replace a licensed physician.
3. If the user mentions red flag symptoms or a medical emergency, advise immediate emergency care (calling 112 in India or visiting the nearest emergency department).
4. Explain conditions in simple, beginner-friendly terms.
5. Emphasize lifestyle, hydration, nutrition, and when to seek professional in-person medical care.
6. Never recommend prescription drug dosages or dangerous off-label treatments.
7. Keep responses concise, clear, and easy to read.`;

    const rawGemini = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const geminiKey = rawGemini && !rawGemini.includes("your_gemini") ? rawGemini.trim() : null;
    const rawOpenAI = process.env.OPENAI_API_KEY;
    const openaiKey = rawOpenAI && !rawOpenAI.includes("your_openai") ? rawOpenAI.trim() : null;

    if (!geminiKey && !openaiKey) {
      return res.status(503).json({
        error: "AI provider is not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to your server .env file.",
        isConfigured: false
      });
    }

    let replyText = "";
    let providerUsed = "";

    // 1. Try Gemini if configured
    if (geminiKey) {
      const geminiModels = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash"];
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || m.text || "" }]
      }));

      for (const model of geminiModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.3,
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              replyText = text;
              providerUsed = `gemini (${model})`;
              break;
            }
          }
        } catch (geminiErr) {
          console.warn(`Gemini ${model} fetch failed:`, geminiErr.message);
        }
      }
    }

    // 2. Try OpenAI if Gemini didn't return text and OpenAI key is available
    if (!replyText && openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((m) => ({
                role: m.role === "model" ? "assistant" : m.role,
                content: m.content || m.text || ""
              }))
            ],
            max_tokens: 800,
            temperature: 0.3,
          })
        });

        if (response.ok) {
          const data = await response.json();
          replyText = data.choices?.[0]?.message?.content;
          if (replyText) providerUsed = "openai";
        }
      } catch (openAiErr) {
        console.warn("OpenAI fetch failed:", openAiErr.message);
      }
    }

    if (!replyText) {
      return res.status(500).json({
        error: "AI providers could not process the request. Please check API key quotas or network connection."
      });
    }

    res.json({
      reply: replyText,
      isEmergency: emergency,
      language: targetLanguage,
      provider: providerUsed
    });

  } catch (err) {
    console.error("Server AI Chat error:", err);
    res.status(500).json({ error: "Internal server error while processing AI request." });
  }
});

app.listen(PORT, () => {
  console.log(`WellWise AI Secure Server running on port ${PORT}`);
});
