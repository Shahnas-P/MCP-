import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "Explain MCP in one simple sentence.",
});

console.log(response.text);