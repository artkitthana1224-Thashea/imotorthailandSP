
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API Key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Get diagnostic advice from Gemini model
export const getDiagnosticAdvice = async (issue: string, vehicleInfo: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `System Diagnosis Request:
      Vehicle: ${vehicleInfo}
      Reported Issue: ${issue}
      Provide a concise 3-point diagnostic checklist for the mechanic. Include potential battery, motor, or controller specific checks for EV motorcycles.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Diagnostic Error:", error);
    return "AI diagnostics currently unavailable. Please follow standard manual inspection procedures.";
  }
};

// Analyze inventory data using Gemini model
export const getInventorySummary = async (parts: any[]) => {
  try {
    const lowStock = parts.filter(p => p.stockLevel <= p.minStock);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As an inventory manager, analyze this low stock data: ${JSON.stringify(lowStock)}. Provide a summary of priority items to reorder and any potential risks for service operations.`,
    });
    return response.text;
  } catch (error) {
    return "Inventory report analysis unavailable.";
  }
};
