export enum TargetModelId {
  // Google
  GEMINI_3_PRO = 'gemini-3-pro-preview',
  GEMINI_3_FLASH = 'gemini-3-flash-preview',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview', // Image
  VEO = 'veo-3.1-generate-preview', // Video
  
  // OpenAI
  GPT_4O = 'gpt-4o',
  GPT_O1 = 'gpt-o1-preview',
  GPT_O1_MINI = 'gpt-o1-mini',
  DALLE_3 = 'dall-e-3',

  // Anthropic
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet',
  CLAUDE_3_OPUS = 'claude-3-opus',

  // MidJourney
  MIDJOURNEY_V6 = 'midjourney-v6',

  // Meta
  LLAMA_3_1_405B = 'llama-3.1-405b',
  LLAMA_3_1_70B = 'llama-3.1-70b',

  // Mistral
  MISTRAL_LARGE = 'mistral-large-2',
}

export type ModelCategory = 'Google' | 'OpenAI' | 'Anthropic' | 'MidJourney' | 'Meta' | 'Mistral' | 'Image/Video';

export interface TargetModel {
  id: TargetModelId;
  name: string;
  provider: string;
  category: ModelCategory;
  description: string;
  color: string; // Tailwind text color class
  bestPractices: string; // Specific prompt engineering instructions for this model
}

export interface OptimizationResponse {
  optimizedPrompt: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}