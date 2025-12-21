export enum TargetModelId {
  // Google (Gemini Advanced)
  GEMINI_3_DEEP_THINK = 'gemini-3-deep-think',
  GEMINI_3_PRO = 'gemini-3-pro',
  GEMINI_3_FLASH = 'gemini-3-flash',
  
  // OpenAI (ChatGPT Plus)
  GPT_5_2_THINKING = 'gpt-5.2-thinking',
  GPT_5_2_INSTANT = 'gpt-5.2-instant',
  GPT_4_1 = 'gpt-4.1',
  O3_PRO = 'o3-pro',

  // Anthropic (Claude Pro)
  CLAUDE_OPUS_4_5 = 'claude-4.5-opus',
  CLAUDE_SONNET_4_5 = 'claude-4.5-sonnet',
  CLAUDE_3_7_SONNET_REASONING = 'claude-3.7-sonnet-reasoning',

  // xAI (Grok)
  GROK_4_1_THINKING = 'grok-4.1-thinking',
  GROK_4 = 'grok-4',
  GROK_3_MINI = 'grok-3-mini',
}

export type ModelCategory = 'Google' | 'OpenAI' | 'Anthropic' | 'xAI';

export interface Source {
  title: string;
  url: string;
}

export interface TargetModel {
  id: TargetModelId;
  name: string;
  provider: string;
  category: ModelCategory;
  description: string;
  color: string; // Tailwind text color class
  bestPractices: string; // Specific prompt engineering instructions for this model
  sources: Source[]; // Documentation sources
}

export interface OptimizationResponse {
  optimizedPrompt: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}