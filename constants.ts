import { TargetModel, TargetModelId } from './types';

export const TARGET_MODELS: TargetModel[] = [
  // --- Google ---
  {
    id: TargetModelId.GEMINI_3_PRO,
    name: 'Gemini 3 Pro',
    provider: 'Google',
    category: 'Google',
    description: 'Complex reasoning, coding, and multi-step tasks.',
    color: 'text-blue-400',
    bestPractices: `
      - Use clear, structured Markdown headers.
      - Explicitly separate instructions from context.
      - For complex tasks, break them down into steps but allow the model flexibility.
      - Gemini handles large context well; verify reference material is clearly demarcated.
      - Use "System Instruction" style formatting where the role is defined first.
    `
  },
  {
    id: TargetModelId.GEMINI_3_FLASH,
    name: 'Gemini 3 Flash',
    provider: 'Google',
    category: 'Google',
    description: 'High-speed, low-latency, high-volume tasks.',
    color: 'text-yellow-400',
    bestPractices: `
      - Be extremely concise and direct.
      - Avoid flowery language; get straight to the instruction.
      - Use bullet points for requirements.
      - Provide examples (few-shot prompting) for specific formatting needs.
    `
  },
  {
    id: TargetModelId.GEMINI_1_5_PRO,
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    category: 'Google',
    description: 'Massive context window (2M+ tokens).',
    color: 'text-blue-300',
    bestPractices: `
      - When using large context, instruct the model to "reference the provided text specifically".
      - Use standard prompt structures: Role, Context, Task, Constraints, Output Format.
    `
  },
  {
    id: TargetModelId.NANO_BANANA_PRO,
    name: 'Nano Banana Pro',
    provider: 'Google',
    category: 'Image/Video',
    description: 'High-quality image generation (Gemini 3 Image).',
    color: 'text-pink-400',
    bestPractices: `
      - Focus on visual descriptions: lighting, composition, style, medium, and color palette.
      - Structure: [Subject], [Action/Context], [Art Style], [Lighting/Atmosphere], [Technical Details].
      - Do NOT use negative prompts (e.g. "no blur"), instead describe what you WANT (e.g. "sharp focus").
      - Specify aspect ratio preferences if relevant to the description context.
    `
  },
  {
    id: TargetModelId.VEO,
    name: 'Veo (Video)',
    provider: 'Google',
    category: 'Image/Video',
    description: 'Generative video model.',
    color: 'text-red-400',
    bestPractices: `
      - Describe the motion explicitly (e.g., "camera pans left", "slow motion zoom").
      - Describe the starting state and the ending state of the scene.
      - Specify the mood and lighting changes over time.
      - Keep prompts under 70 words for best adherence.
    `
  },

  // --- OpenAI ---
  {
    id: TargetModelId.GPT_4O,
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'General purpose flagship.',
    color: 'text-green-400',
    bestPractices: `
      - Use the CO-STAR framework: Context, Objective, Style, Tone, Audience, Response format.
      - Clearly allow for "thinking" or "step-by-step" breakdown for math/logic.
      - Use delimiters like ### or \"\"\" to separate data from instructions.
    `
  },
  {
    id: TargetModelId.GPT_O1,
    name: 'GPT-o1 (Reasoning)',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'Advanced reasoning, chain-of-thought native.',
    color: 'text-purple-400',
    bestPractices: `
      - CRITICAL: Do NOT use "think step by step" or "explain your reasoning" instructions; the model does this automatically and hiddenly.
      - Focus purely on the FINAL goal and constraints.
      - Avoid "guidance" prompts that tell the model *how* to think; just tell it *what* to solve.
      - For coding, simply ask for the code solution, not the plan.
    `
  },
  {
    id: TargetModelId.GPT_O1_MINI,
    name: 'GPT-o1 Mini',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'Faster reasoning model.',
    color: 'text-purple-300',
    bestPractices: `
      - Same as O1: No "chain of thought" prompting.
      - Keep context very strict and limited to the problem at hand.
      - Ideal for math, science, and strict coding logic.
    `
  },
  {
    id: TargetModelId.DALLE_3,
    name: 'DALL-E 3',
    provider: 'OpenAI',
    category: 'Image/Video',
    description: 'Conversational image generation.',
    color: 'text-teal-400',
    bestPractices: `
      - Use natural, descriptive sentences rather than tag clouds.
      - Describe the image as if explaining it to a blind person.
      - Mention specific details about text rendering if text is required in the image.
    `
  },

  // --- Anthropic ---
  {
    id: TargetModelId.CLAUDE_3_5_SONNET,
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    category: 'Anthropic',
    description: 'Excellent at coding and nuance.',
    color: 'text-orange-400',
    bestPractices: `
      - HEAVILY favors XML tags for structure (e.g., <instructions>, <context>, <examples>, <input>).
      - Assign a specific persona/role at the very beginning.
      - Break complex tasks into a "chain of thought" instruction explicitly asking Claude to "think inside <thinking> tags" before outputting.
      - Use "pre-filling" style (simulated here) where you define the start of the response.
    `
  },
  {
    id: TargetModelId.CLAUDE_3_OPUS,
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    category: 'Anthropic',
    description: 'Deepest reasoning for creative writing.',
    color: 'text-orange-300',
    bestPractices: `
      - Use XML tags strictly.
      - Prompt for detailed outlining before generation.
      - Excellent at adopting specific tones/styles if provided with samples.
    `
  },

  // --- MidJourney ---
  {
    id: TargetModelId.MIDJOURNEY_V6,
    name: 'MidJourney v6',
    provider: 'MidJourney',
    category: 'MidJourney',
    description: 'Artistic image generation.',
    color: 'text-white',
    bestPractices: `
      - Syntax is Key: /imagine prompt: [Description] --parameters.
      - Put the most important subjects FIRST.
      - Use parameters: --ar 16:9 (aspect ratio), --v 6.0, --stylize [0-1000], --weird [0-3000].
      - Avoid prepositional phrases; use commas to separate concepts.
      - Mention medium (e.g., "shot on 35mm", "oil painting").
    `
  },

  // --- Meta ---
  {
    id: TargetModelId.LLAMA_3_1_405B,
    name: 'Llama 3.1 (405B)',
    provider: 'Meta',
    category: 'Meta',
    description: 'Open source frontier model.',
    color: 'text-blue-600',
    bestPractices: `
      - Be very direct.
      - Use standard Markdown formatting.
      - It adheres strictly to "System" prompts, so define the safety guardrails and role clearly there.
      - Good at following specific JSON schema outputs.
    `
  },

  // --- Mistral ---
  {
    id: TargetModelId.MISTRAL_LARGE,
    name: 'Mistral Large 2',
    provider: 'Mistral',
    category: 'Mistral',
    description: 'European flagship model.',
    color: 'text-yellow-600',
    bestPractices: `
      - Concise, no-nonsense prompting.
      - Strong multilingual capabilities; specify language explicitly if mixing.
      - Good at function calling structures.
    `
  },
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