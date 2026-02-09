
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStickyAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the wishyoua App AI Assistant. You are friendly, concise, and helpful. You help users understand how wishyoua makes messaging simple, reliable, and private. User asks: ${query}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now, but I'm usually much smarter than this! Try again in a second.";
  }
};

export const getPropertyAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the VistaHaven Real Estate AI Advisor. You provide expert insights on property investments, luxury residences, and sustainable living. Be professional, informative, and encouraging. User asks: ${query}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm unable to provide real estate advice at the moment. Please try again shortly or contact our agents directly.";
  }
};
