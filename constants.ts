import { TargetModel, TargetModelId } from './types';

export const TARGET_MODELS: TargetModel[] = [
  // --- Google (Gemini Advanced) ---
  {
    id: TargetModelId.GEMINI_3_DEEP_THINK,
    name: 'Gemini 3 Deep Think',
    provider: 'Google',
    category: 'Google',
    description: 'Complex hypothesis exploration & problem solving.',
    color: 'text-blue-400',
    bestPractices: `
      - Do NOT provide solution steps; the model explores multiple hypotheses automatically.
      - State the problem clearly and ask for a "comprehensive exploration of alternatives" before the final answer.
      - Use <context> tags to provide massive amounts of background data; it handles 5M+ tokens effectively.
    `,
    sources: [
      { title: 'Gemini 3 Technical Report', url: 'https://deepmind.google/technologies/gemini/flash/' },
      { title: 'System Instructions Guide', url: 'https://ai.google.dev/gemini-api/docs/system-instructions' }
    ]
  },
  {
    id: TargetModelId.GEMINI_3_PRO,
    name: 'Gemini 3 Pro',
    provider: 'Google',
    category: 'Google',
    description: 'Frontier multimodal model (Text, Code, AV).',
    color: 'text-blue-500',
    bestPractices: `
      - Use standard structured prompting (Role, Context, Task).
      - For multimodal inputs, explicitly reference image/video timestamps in the text prompt.
      - Use "System Instruction" formatting for behavioral constraints.
    `,
    sources: [
      { title: 'Gemini Prompting Strategies', url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies' }
    ]
  },
  {
    id: TargetModelId.GEMINI_3_FLASH,
    name: 'Gemini 3 Flash',
    provider: 'Google',
    category: 'Google',
    description: 'High-speed, massive context window.',
    color: 'text-yellow-400',
    bestPractices: `
      - Direct, imperative commands work best.
      - Reduce politeness/padding to save tokens and reduce latency.
      - Use JSON schemas for data extraction tasks.
    `,
    sources: [
      { title: 'Long Context Best Practices', url: 'https://ai.google.dev/gemini-api/docs/long-context' }
    ]
  },

  // --- OpenAI (ChatGPT Plus) ---
  {
    id: TargetModelId.GPT_5_2_THINKING,
    name: 'GPT-5.2 (Thinking)',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'Flagship reasoning & deep research.',
    color: 'text-purple-400',
    bestPractices: `
      - Strictly forbidden: "Think step by step" or "Chain of thought" instructions. The model does this internally.
      - Focus entirely on defining the *success criteria* and the *constraints*.
      - For research, specify the "depth" of citation required (e.g., "academic level").
    `,
    sources: [
      { title: 'Reasoning Model Beta Docs', url: 'https://platform.openai.com/docs/guides/reasoning' },
      { title: 'GPT-5 System Card', url: 'https://openai.com/index/gpt-5-system-card' }
    ]
  },
  {
    id: TargetModelId.GPT_5_2_INSTANT,
    name: 'GPT-5.2 (Instant)',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'High-speed general purpose.',
    color: 'text-green-400',
    bestPractices: `
      - Use the CO-STAR framework (Context, Objective, Style, Tone, Audience, Response).
      - Break complex instructions into numbered lists.
      - Explicitly ask for "conciseness" to override its tendency to be verbose.
    `,
    sources: [
      { title: 'Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' }
    ]
  },
  {
    id: TargetModelId.GPT_4_1,
    name: 'GPT-4.1',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'Optimized for coding & instruction following.',
    color: 'text-green-500',
    bestPractices: `
      - Provide specific library versions when asking for code (e.g., "React 19").
      - Use "Role-play" prompting to set the expertise level (e.g., "Senior Systems Architect").
    `,
    sources: [
      { title: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/' }
    ]
  },
  {
    id: TargetModelId.O3_PRO,
    name: 'o3-pro',
    provider: 'OpenAI',
    category: 'OpenAI',
    description: 'Advanced science, math, and coding.',
    color: 'text-indigo-400',
    bestPractices: `
      - Provide raw data or equations directly; do not simplify inputs.
      - Do not use conversational filler.
      - Specify the output format strictly (e.g., "Latex", "Python script only").
    `,
    sources: [
      { title: 'o3-pro Release Notes', url: 'https://openai.com/index/o3-pro-release' }
    ]
  },

  // --- Anthropic (Claude Pro) ---
  {
    id: TargetModelId.CLAUDE_OPUS_4_5,
    name: 'Claude Opus 4.5',
    provider: 'Anthropic',
    category: 'Anthropic',
    description: 'Agentic tasks, coding, and nuance.',
    color: 'text-orange-300',
    bestPractices: `
      - MANDATORY: Use XML tags for everything (<context>, <goal>, <constraints>).
      - "Prefill" the response by typing the first sentence for the model in the prompt.
      - For agentic tasks, define the available "tools" in XML format even if they are hypothetical.
    `,
    sources: [
      { title: 'Claude 4.5 System Prompts', url: 'https://docs.anthropic.com/en/docs/system-prompts' },
      { title: 'Long Context Window Tips', url: 'https://docs.anthropic.com/en/docs/long-context-window-tips' }
    ]
  },
  {
    id: TargetModelId.CLAUDE_SONNET_4_5,
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    category: 'Anthropic',
    description: 'Balanced daily driver.',
    color: 'text-orange-400',
    bestPractices: `
      - Use XML tags for structure.
      - Ask Claude to "Think inside <antThinking> tags" before answering to improve logic.
      - Be explicit about tone (e.g., "Professional but conversational").
    `,
    sources: [
      { title: 'Prompt Engineering Interactive Tutorial', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial' }
    ]
  },
  {
    id: TargetModelId.CLAUDE_3_7_SONNET_REASONING,
    name: 'Claude 3.7 Sonnet (Reasoning)',
    provider: 'Anthropic',
    category: 'Anthropic',
    description: 'User-controlled reasoning depth.',
    color: 'text-orange-500',
    bestPractices: `
      - Explicitly state the "Reasoning Budget" in the prompt (e.g., "Spend significant time analyzing X").
      - Use the Chain of Density prompt technique to refine summaries recursively.
    `,
    sources: [
      { title: 'Claude 3.7 Model Card', url: 'https://www.anthropic.com/news/claude-3-7-sonnet' }
    ]
  },

  // --- xAI (Grok) ---
  {
    id: TargetModelId.GROK_4_1_THINKING,
    name: 'Grok 4.1 (Thinking)',
    provider: 'xAI',
    category: 'xAI',
    description: 'Logic puzzles and deep queries.',
    color: 'text-white',
    bestPractices: `
      - Challenge the model; it responds well to being told "This is a difficult problem."
      - Do not restrict its "personality" unless necessary for a formal output.
      - Allow it to access "real-time" concepts in the prompt logic.
    `,
    sources: [
      { title: 'Grok-4 Technical Blog', url: 'https://x.ai/blog/grok-4' }
    ]
  },
  {
    id: TargetModelId.GROK_4,
    name: 'Grok 4',
    provider: 'xAI',
    category: 'xAI',
    description: 'Real-time data & uninhibited mode.',
    color: 'text-zinc-300',
    bestPractices: `
      - Specify "Fun Mode" vs "Regular Mode" explicitly.
      - If asking about news, specify "Search X for the latest updates on...".
      - It tolerates more casual/slang-heavy prompting than other models.
    `,
    sources: [
      { title: 'xAI API Documentation', url: 'https://docs.x.ai/' }
    ]
  },
  {
    id: TargetModelId.GROK_3_MINI,
    name: 'Grok 3 Mini',
    provider: 'xAI',
    category: 'xAI',
    description: 'Lightweight & fast.',
    color: 'text-zinc-400',
    bestPractices: `
      - Keep prompts short and to the point.
      - Avoid complex multi-step reasoning instructions; break them into separate prompts.
    `,
    sources: [
      { title: 'Grok-3 Release Announcement', url: 'https://x.ai/blog/grok-3' }
    ]
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