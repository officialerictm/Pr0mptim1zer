import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResponse, TargetModelId } from '../types';
import { DEFAULT_SYSTEM_INSTRUCTION, TARGET_MODELS } from '../constants';

export const optimizePrompt = async (
  originalPrompt: string,
  targetModelId: TargetModelId,
  isDeepMode: boolean = false
): Promise<OptimizationResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  // Find the target model details to get its specific best practices
  const targetModel = TARGET_MODELS.find(m => m.id === targetModelId);
  const bestPractices = targetModel?.bestPractices || "Use general advanced prompt engineering best practices.";
  const modelName = targetModel?.name || targetModelId;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-pro-preview"; // The brain of the operation

  // --- PASS 1: Initial Generation ---
  const promptPass1 = `
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
    const response1 = await ai.models.generateContent({
      model: modelId,
      contents: promptPass1,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["optimizedPrompt", "explanation"]
        }
      }
    });

    const result1 = JSON.parse(response1.text || "{}") as OptimizationResponse;

    if (!isDeepMode) {
      return result1;
    }

    // --- PASS 2: Deep Optimization (Critique & Refine) ---
    const promptPass2 = `
      TASK: Perform a RIGOROUS CRITIQUE and REFINEMENT of a generated prompt.

      ORIGINAL USER INTENT:
      """
      ${originalPrompt}
      """

      DRAFT PROMPT (Generated in Pass 1):
      """
      ${result1.optimizedPrompt}
      """

      TARGET MODEL CONSTRAINTS (${modelName}):
      """
      ${bestPractices}
      """

      INSTRUCTIONS:
      1. Act as a Senior Principal Prompt Engineer.
      2. Critique the DRAFT PROMPT. Does it *actually* follow the best practices? Is it concise? Did it hallucinate restrictions?
      3. Rewrite the prompt to be absolutely perfect for ${modelName}.
      4. If the Draft was already perfect, return it unchanged.
      5. Update the explanation to briefly summarize the refinement.
    `;

    const response2 = await ai.models.generateContent({
      model: modelId,
      contents: promptPass2,
      config: {
        systemInstruction: "You are a perfectionist critic. You fix subtle errors in prompt engineering.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedPrompt: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["optimizedPrompt", "explanation"]
        }
      }
    });

    const result2 = JSON.parse(response2.text || "{}") as OptimizationResponse;
    
    // Append a badge to the explanation so the user knows it was deep-optimized
    return {
      optimizedPrompt: result2.optimizedPrompt,
      explanation: `[Deep Mode] ${result2.explanation}`
    };

  } catch (error) {
    console.error("Optimization failed:", error);
    throw new Error("Failed to optimize prompt. Please try again.");
  }
};