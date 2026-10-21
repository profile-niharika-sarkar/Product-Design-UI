import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dynamic AI client lazy getter
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Routes ---

  // Health and config status check
  app.get("/api/config", (req, res) => {
    res.json({
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // Gemini creative campaign strategy generation endpoint
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { brandName, industry, targetAudience, coreMessage, campaignTone } = req.body;

      if (!brandName || !industry || !targetAudience) {
        return res.status(400).json({
          error: "Missing required brand parameters. Brand name, industry, and target audience are necessary.",
        });
      }

      const client = getAiClient();

      const userPrompt = `
Generate a detailed creative marketing and outdoor media campaign brief based on the following brand metadata:
- Brand Name: ${brandName}
- Industry Slot: ${industry}
- Key Audience Demographic: ${targetAudience}
- Core Message Focus: ${coreMessage || "Innovation, quality, and direct value"}
- Tone of Voice: ${campaignTone || "Bold and cinematic"}

Structure the response logically according to OOH premium advertising standards. Give us:
- Unique narrative names
- A punchy 4-to-6 word billboard headliner slogan
- Visual asset suggestions (high-illumination creative specs)
- 3 distinct guerrilla or high-engagement social extension ideas
- Demographic conversion justification based on market patterns.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "You are an elite, award-winning Chief Marketing Officer and Out-of-Home (OOH) media strategist. You construct high-impact billboard slogans, data-backed conversion narratives, and powerful physical elements for urban spectacles. Output strictly valid, compliant JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignName: {
                type: Type.STRING,
                description: "Clean, professional campaign title.",
              },
              tagline: {
                type: Type.STRING,
                description: "Punchy, modern billboard slogan (maximum 5-6 words). Keep it highly intense and memorable.",
              },
              billboardConcept: {
                type: Type.STRING,
                description: "A rich creative direction for the physical/digital billboard, specifying lighting, textures, dynamic display modes, and depth layers.",
              },
              additionalStrategies: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "3 strategic guerrilla marketing, street stunts, or social media activations connected to this OOH campaign.",
              },
              conversionProjection: {
                type: Type.STRING,
                description: "A professional pitch explaining why this exact visual style and tagline converts the target audience.",
              },
            },
            required: [
              "campaignName",
              "tagline",
              "billboardConcept",
              "additionalStrategies",
              "conversionProjection",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response output content returned by Gemini.");
      }

      const parsedContent = JSON.parse(responseText.trim());
      res.json({ success: true, data: parsedContent });
    } catch (err: any) {
      console.error("Gemini creative campaign generator failed:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Internal server error occurred when calling the Gemini engine.",
      });
    }
  });

  // --- Serve Frontend Application via Vite / Static files ---

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
    console.log(`[Server] Split Slider App running at http://localhost:${PORT}`);
  });
}

startServer();
