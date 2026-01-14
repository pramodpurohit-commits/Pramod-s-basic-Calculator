
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const solveMathProblem = async (problem: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Solve this math problem or explain this concept clearly and concisely: "${problem}". Keep the answer short and focused on the calculation.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    return response.text || "I couldn't solve that. Please try again with a clearer problem.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Error communicating with the AI. Please check your connection.";
  }
};
