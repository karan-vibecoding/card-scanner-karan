import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    const maxRetries = 4;
    let delay = 600;
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
                data: image,
                mimeType: mimeType || "image/jpeg",
              },
            },
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
          },
        });
        break;
      } catch (error: any) {
        lastError = error;
        const status =
          error.status ||
          error.statusCode ||
          (error.message && error.message.match(/\b(429|503)\b/)?.[0]);
        if (status && attempt < maxRetries) {
          console.warn(
            `OCR Gemini API Rate Limit hit (Status: ${status}), retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }

    if (!response || !response.text) {
      throw new Error("No response returned from Gemini after retries");
    }

    let text = response.text;
    if (text.includes("```json")) {
      text = text.replace(/```json\n?/, "").replace(/```\n?$/, "");
    } else if (text.includes("```")) {
      text = text.replace(/```\n?/, "").replace(/```\n?$/, "");
    }

    const json = JSON.parse(text);
    res.json(json);
  } catch (error: any) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: error.message || "Failed to process image" });
  }
}
