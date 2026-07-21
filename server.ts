import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import admin from "firebase-admin";

// Initialize Firebase Admin (optional, for securing endpoints if needed, but here we just need to initialize app to avoid errors if we want to use it)
// We will just do a dummy initialization or skip it since we just use Gemini server-side right now
// But since we installed firebase-admin, let's keep it minimal if not needed.

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API route for OCR using Gemini
  app.post("/api/ocr", async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
         return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        Analyze this business card and extract the following information.
        Return the result as a strict JSON object (do not include markdown formatting like \`\`\`json).
        Extract:
        - fullName (the complete full name as it appears on the card)
        - firstName (the first name or first half of the full name)
        - lastName (the last name or second/last half of the full name)
        - company
        - designation (job title)
        - phoneNumbers (array of strings)
        - emails (array of strings)
        - website
        - address
        - linkedIn (if found)
        - socialLinks (array of strings, excluding LinkedIn)
        - notes (any other readable text not fitting above fields)
      `;

      // Implement robust retry logic with exponential backoff to handle rate limits (429)
      const maxRetries = 4;
      let delay = 600; // ms
      let response = null;
      let lastError = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              prompt,
              {
                inlineData: {
                  data: image, // base64 string
                  mimeType: mimeType || "image/jpeg",
                }
              }
            ],
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  firstName: { type: Type.STRING },
                  lastName: { type: Type.STRING },
                  company: { type: Type.STRING },
                  designation: { type: Type.STRING },
                  phoneNumbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  emails: { type: Type.ARRAY, items: { type: Type.STRING } },
                  website: { type: Type.STRING },
                  address: { type: Type.STRING },
                  linkedIn: { type: Type.STRING },
                  socialLinks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  notes: { type: Type.STRING },
                },
              },
            }
          });
          break; // success! break retry loop
        } catch (error: any) {
          lastError = error;
          const status = error.status || error.statusCode || (error.message && error.message.match(/\b(429|503)\b/)?.[0]);
          if (status && attempt < maxRetries) {
            console.warn(`OCR Gemini API Rate Limit / Transient error hit (Status: ${status}), retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
          } else {
            throw error; // Not a rate limit error or we are out of retries, throw immediately
          }
        }
      }

      if (!response || !response.text) {
         throw new Error("No response returned from Gemini after retries");
      }
      
      let text = response.text;
      if (text.includes("```json")) {
        text = text.replace(/```json\n?/, '').replace(/```\n?$/, '');
      } else if (text.includes("```")) {
        text = text.replace(/```\n?/, '').replace(/```\n?$/, '');
      }

      const json = JSON.parse(text);
      res.json(json);
    } catch (error: any) {
      console.error("OCR Error:", error);
      res.status(500).json({ error: error.message || "Failed to process image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
