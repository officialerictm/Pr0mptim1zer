import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResponse, TargetModelId } from '../types';
import { DEFAULT_SYSTEM_INSTRUCTION, TARGET_MODELS } from '../constants';

export const optimizePrompt = async (
  originalPrompt: string,
  targetModelId: TargetModelId
): Promise<OptimizationResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  // Find the target model details to get its specific best practices
  const targetModel = TARGET_MODELS.find(m => m.id === targetModelId);
  const bestPractices = targetModel?.bestPractices || "Use general advanced prompt engineering best practices.";
  const modelName = targetModel?.name || targetModelId;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // We construct a specific prompt that gives the optimizer (Gemini) the context it needs
  const prompt = `
    TASK: Optimize the User Draft for the Target Model.
    
    TARGET MODEL: ${modelName}
    
    STRICT BEST PRACTICES FOR ${modelName}:
    """
    ${bestPractices}
    """

    USER DRAFT:
    """
    ${originalPrompt}
    """
    
    Requirements:
    1. Apply the best practices listed above.
    2. Maintain the user's original intent perfectly.
    3. Return the result in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // The brain of the operation
      contents: prompt,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: {
              type: Type.STRING,
              description: "The fully rewritten, optimized prompt ready to be pasted."
            },
            explanation: {
              type: Type.STRING,
              description: "A very brief explanation of the optimization technique used."
            }
          },
          required: ["optimizedPrompt", "explanation"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(responseText) as OptimizationResponse;
    return data;

  } catch (error) {
    console.error("Optimization failed:", error);
    throw new Error("Failed to optimize prompt. Please try again.");
  }
};