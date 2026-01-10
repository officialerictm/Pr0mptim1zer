import { TargetModel, TargetModelId } from './types';

export const TARGET_MODELS: TargetModel[] = [
  // ==================================================================================
  // OPENAI
  // ==================================================================================
  {
    id: TargetModelId.GPT_5_2,
    name: 'GPT-5.2',
    brand: 'ChatGPT',
    isDefault: true,
    provider: 'OpenAI',
    mode: 'chat',
    description: 'Flagship. High intelligence, natural conversation.',
    color: 'text-emerald-400',
    bestPractices: `
      - Conversational tone preferred.
      - Use "Custom Instructions" persona format.
      - Explicitly request "No yapping" for concise answers.
    `,
    sources: [{ title: 'GPT-5 System Card', url: 'https://openai.com/' }]
  },
  {
    id: TargetModelId.O3_PRO,
    name: 'o3-pro',
    brand: 'ChatGPT',
    provider: 'OpenAI',
    mode: 'chat',
    description: 'Deep reasoning & research tasks.',
    color: 'text-emerald-300',
    bestPractices: `
      - Do NOT use "Think step by step" (it does this natively).
      - Define the output format clearly (e.g., "Report with Executive Summary").
      - Allow it to "browse" for verification.
    `,
    sources: [{ title: 'Reasoning Best Practices', url: 'https://platform.openai.com/docs/guides/reasoning' }]
  },
  {
    id: TargetModelId.O4_MINI,
    name: 'o4-mini',
    brand: 'ChatGPT',
    provider: 'OpenAI',
    mode: 'chat',
    description: 'Fast reasoning for logic puzzles/math.',
    color: 'text-emerald-200',
    bestPractices: `
      - Structured input (JSON/XML) works best.
      - Keep instructions short and imperative.
    `,
    sources: [{ title: 'OpenAI Efficiency', url: 'https://openai.com/' }]
  },
  {
    id: TargetModelId.GPT_5_MINI,
    name: 'GPT-5 mini',
    brand: 'ChatGPT',
    provider: 'OpenAI',
    mode: 'api',
    description: 'Cost-effective API endpoint.',
    color: 'text-emerald-500',
    bestPractices: `
      - Use JSON Schema for structured data extraction.
      - Set temperature to 0 for deterministic tasks.
    `,
    sources: [{ title: 'OpenAI API Docs', url: 'https://platform.openai.com/' }]
  },

  // ==================================================================================
  // ANTHROPIC
  // ==================================================================================
  {
    id: TargetModelId.CLAUDE_SONNET_4_5,
    name: 'Claude 4.5 Sonnet',
    brand: 'Claude',
    isDefault: true,
    provider: 'Anthropic',
    mode: 'chat',
    description: 'Balanced intelligence & speed. Coding powerhouse.',
    color: 'text-orange-400',
    bestPractices: `
      - Use XML tags (<context>, <instruction>) to structure prompt.
      - Assign a role via System Prompt.
      - Chain-of-Thought: Ask it to "Think inside <antThinking> tags".
    `,
    sources: [{ title: 'Claude Prompt Engineering', url: 'https://docs.anthropic.com/' }]
  },
  {
    id: TargetModelId.CLAUDE_OPUS_4_5,
    name: 'Claude 4.5 Opus',
    brand: 'Claude',
    provider: 'Anthropic',
    mode: 'api',
    description: 'Maximum intelligence, slower inference.',
    color: 'text-orange-300',
    bestPractices: `
      - "Prefill" the response by ending your prompt with the start of the desired output (e.g., "{").
      - Be extremely verbose about edge cases.
    `,
    sources: [{ title: 'Prefill Strategies', url: 'https://docs.anthropic.com/' }]
  },

  // ==================================================================================
  // GOOGLE
  // ==================================================================================
  {
    id: TargetModelId.GEMINI_3_PRO,
    name: 'Gemini 3 Pro',
    brand: 'Gemini',
    isDefault: true,
    provider: 'Google',
    mode: 'chat',
    description: 'Complex multimodal tasks.',
    color: 'text-blue-400',
    bestPractices: `
      - Place instructions *after* large context/documents.
      - Explicitly ask for "Grounding" if you need factual verification.
      - Use "System Instructions" for role definition.
    `,
    sources: [{ title: 'Gemini 3 Technical Report', url: 'https://deepmind.google/technologies/gemini/' }]
  },
  {
    id: TargetModelId.GEMINI_3_FLASH,
    name: 'Gemini 3 Flash',
    brand: 'Gemini',
    provider: 'Google',
    mode: 'api',
    description: 'High volume, low latency.',
    color: 'text-blue-300',
    bestPractices: `
      - Imperative commands. Remove "please".
      - Few-shot prompting (3-5 examples) drastically improves reliability.
    `,
    sources: [{ title: 'Gemini API', url: 'https://ai.google.dev/' }]
  },

  // ==================================================================================
  // MICROSOFT
  // ==================================================================================
  {
    id: TargetModelId.COPILOT_PRO,
    name: 'Copilot Pro',
    brand: 'Copilot',
    isDefault: true,
    provider: 'Microsoft',
    mode: 'chat',
    description: 'Office 365 & Web integration.',
    color: 'text-indigo-400',
    bestPractices: `
      - Reference specific Microsoft 365 apps if needed (e.g., "Format for Word").
      - Use "Balanced" mode instructions for creative writing.
    `,
    sources: [{ title: 'Copilot Lab', url: 'https://copilot.microsoft.com/' }]
  },

  // ==================================================================================
  // OTHERS
  // ==================================================================================
  {
    id: TargetModelId.DEEPSEEK_R1,
    name: 'DeepSeek R1',
    brand: 'Other',
    isDefault: true,
    provider: 'DeepSeek',
    mode: 'chat',
    description: 'Open-weights reasoning model.',
    color: 'text-cyan-400',
    bestPractices: `
      - Zero-shot only for logic. Do not provide examples.
      - Enforce output format (e.g., "Answer in <answer> block").
    `,
    sources: [{ title: 'DeepSeek R1 Paper', url: 'https://github.com/deepseek-ai/DeepSeek-R1' }]
  },
  {
    id: TargetModelId.GROK_4,
    name: 'Grok 4',
    brand: 'Other',
    provider: 'xAI',
    mode: 'chat',
    description: 'Real-time X data access.',
    color: 'text-zinc-200',
    bestPractices: `
      - Specify "Fun Mode" vs "Normal Mode".
      - Ask for real-time tweets/posts as context.
    `,
    sources: [{ title: 'xAI Blog', url: 'https://x.ai/' }]
  },
  {
    id: TargetModelId.MISTRAL_LARGE_3,
    name: 'Mistral Large 3',
    brand: 'Other',
    provider: 'Mistral',
    mode: 'api',
    description: 'European flagship, strong multi-lingual.',
    color: 'text-yellow-400',
    bestPractices: `
      - Strong instruction following.
      - Prefers concise prompts.
    `,
    sources: [{ title: 'Mistral Docs', url: 'https://docs.mistral.ai/' }]
  },
  {
    id: TargetModelId.LLAMA_4,
    name: 'Llama 4',
    brand: 'Other',
    provider: 'Meta',
    mode: 'api',
    description: 'Open source standard.',
    color: 'text-blue-500',
    bestPractices: `
      - Use Llama-specific system tokens if running raw.
      - Chain-of-thought helps significantly with math.
    `,
    sources: [{ title: 'Llama 4 Release', url: 'https://llama.meta.com/' }]
  }
];

export const DEFAULT_SYSTEM_INSTRUCTION = `You are Pr0mptim1zer, an expert prompt engineer and LLM architect. 
Your goal is to rewrite user inputs into highly optimized prompts specifically tailored for a target Large Language Model.

1. Analyze the user's intent.
2. Identify the target model selected.
3. Review the "Best Practices" provided for this specific model.
4. Rewrite the prompt applying these specific structures, tokens, or formatting rules.
5. Do NOT answer the user's prompt. ONLY rewrite it.
6. Provide a very brief (one sentence) explanation of the key optimization technique used.

Output format must be JSON.`;