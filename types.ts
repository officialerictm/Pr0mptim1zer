export enum TargetModelId {
  // OpenAI
  GPT_5_2 = 'gpt-5.2',
  GPT_5_MINI = 'gpt-5-mini',
  O3_PRO = 'o3-pro',
  O4_MINI = 'o4-mini',

  // Anthropic
  CLAUDE_SONNET_4_5 = 'claude-sonnet-4.5',
  CLAUDE_OPUS_4_5 = 'claude-opus-4.5',

  // Google
  GEMINI_3_PRO = 'gemini-3-pro',
  GEMINI_3_FLASH = 'gemini-3-flash',

  // Microsoft
  COPILOT_PRO = 'copilot-pro',

  // Others
  DEEPSEEK_R1 = 'deepseek-r1',
  GROK_4 = 'grok-4',
  MISTRAL_LARGE_3 = 'mistral-large-3',
  LLAMA_4 = 'llama-4',
}

export type ModelProvider = 'OpenAI' | 'Google' | 'Anthropic' | 'Microsoft' | 'DeepSeek' | 'xAI' | 'Mistral' | 'Meta';
export type ModelMode = 'chat' | 'api';
export type ModelBrand = 'ChatGPT' | 'Gemini' | 'Copilot' | 'Claude' | 'Other';

export interface Source {
  title: string;
  url: string;
}

export interface TargetModel {
  id: TargetModelId;
  name: string;
  brand: ModelBrand;     // The high-level consumer brand (e.g., "ChatGPT")
  isDefault?: boolean;   // If true, this is the model selected when the Brand is chosen in simple mode
  provider: ModelProvider;
  mode: ModelMode;       // Chat App vs Developer API categorization
  description: string;
  color: string;         // Tailwind text color class
  bestPractices: string; // Specific prompt engineering instructions for this model
  sources: Source[];     // Documentation sources
}

export interface OptimizationResponse {
  optimizedPrompt: string;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}