import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PRODUCTS, CATALOG_CONTEXT } from '../constants';
import { Product } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model selection
const MODEL_CHAT = 'gemini-2.5-flash';

/**
 * Handles general chat interactions with RAG context injected via System Instructions.
 * Supports multimodal input (text + images).
 */
export const sendMessageToAssistant = async (
  message: string,
  history: { role: string; parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] }[]
) => {
  try {
    // Format history for the API: ensure valid parts
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    const chat = ai.chats.create({
      model: MODEL_CHAT,
      config: {
        systemInstruction: CATALOG_CONTEXT,
        temperature: 0.7,
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting to the server right now. Please try again later.";
  }
};

/**
 * Uses Gemini's JSON Schema mode to return structured product recommendations.
 * This functions as a "Recommender System".
 */
export const getProductRecommendations = async (userQuery: string): Promise<Product[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_CHAT,
      contents: `User Request: "${userQuery}".
      Based on the catalog provided in the system instruction, identify the most relevant products.
      Return a JSON object containing an array of product IDs that match best.`,
      config: {
        systemInstruction: CATALOG_CONTEXT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text);
    const ids = data.recommendedProductIds || [];

    // Filter the actual product objects based on IDs returned by AI
    const recommended = MOCK_PRODUCTS.filter(p => ids.includes(p.id));
    return recommended;

  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return [];
  }
};