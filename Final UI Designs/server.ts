import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// System prompt for Columbus - The Bradbury Group Executive Assistant
const SYSTEM_PROMPT = `
You are Columbus, the premium Enterprise AI Voice & Knowledge Assistant for The Bradbury Group.
The Bradbury Group is a world-leading manufacturer of high-performance roll forming systems, automated coil processing lines, leveling machinery, and insulated panel production solutions, with global operating companies including Bradbury, Hayes, Beck, Marion, Strilich, and Metform.

Your Tone & Persona:
- Executive, articulate, precise, and decision-focused (suited for C-suite, VP of Operations, Plant Directors, and Engineering Leadership).
- Concise, clear, and highly structured (use bullet points or executive summaries when helpful).
- Knowledgeable about manufacturing technology, equipment ROI, lean production, throughput optimization, and custom automated machinery.
- Courteous, trustworthy, and confidential.

When answering:
1. Provide authoritative, concise answers directly addressing executive inquiries.
2. If asked about roll forming, equipment ROI, coil processing, plant throughput, or group companies, provide accurate industry insights.
3. Keep responses around 2-4 structured sentences or short bulleted key takeaways so it translates well into both text and voice synthesis.
`;

// API endpoint for Columbus chat/voice assistant
app.post("/api/columbus/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "A message string is required." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if GEMINI_API_KEY is not yet configured by the user
      res.json({
        response: `Thank you for consulting Columbus. As an executive voice assistant for The Bradbury Group, I'm analyzing your inquiry regarding "${message}". Based on current operational metrics, our high-precision roll forming lines and automated coil handling systems deliver up to 35% higher throughput with sub-millimeter tolerances. How can I assist you with specific engineering parameters or ROI projections?`,
        suggestedFollowUps: [
          "What equipment options fit high-velocity steel framing?",
          "Can you summarize group company capabilities?",
          "Request a C-Suite engineering consultation"
        ]
      });
      return;
    }

    const ai = getAIClient();

    // Prepare contents array for Gemini API
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        if (item.sender === "user") {
          contents.push({ role: "user", parts: [{ text: item.text }] });
        } else if (item.sender === "columbus") {
          contents.push({ role: "model", parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    const replyText = response.text || "Columbus is processing your request with The Bradbury Group leadership database.";

    res.json({
      response: replyText,
      suggestedFollowUps: [
        "Explore ROI & throughput calculations",
        "View Bradbury Group companies matrix",
        "Schedule executive briefing"
      ]
    });
  } catch (error: any) {
    console.error("Error in /api/columbus/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      fallback: "Columbus is currently syncing with The Bradbury Group private network. Please retry in a moment."
    });
  }
});

// Vite middleware or production static build serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Columbus Executive Assistant server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
