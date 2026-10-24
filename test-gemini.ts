import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3.8-flash", // replace with the Flash model name from AI Studio
  contents: "Give me one encouraging sentence for a first-time hackathon participant.",
});

console.log(response.text);