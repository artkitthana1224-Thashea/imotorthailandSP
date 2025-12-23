
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API Key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Get diagnostic advice from Gemini model
export const getDiagnosticAdvice = async (issue: string, vehicleInfo: string) => {
  try {
    // Upgraded to gemini-3-pro-preview for complex reasoning task as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
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
    // Fix: Using snake_case properties from Part interface for correct filtering
    const lowStock = parts.filter(p => p.stock_level <= p.min_stock);
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `As an inventory manager, analyze this low stock data: ${JSON.stringify(lowStock)}. Provide a summary of priority items to reorder and any potential risks for service operations.`,
    });
    return response.text;
  } catch (error) {
    return "Inventory report analysis unavailable.";
  }
};
