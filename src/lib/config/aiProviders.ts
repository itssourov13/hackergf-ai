export type ModelId =
  | "automatic"
  | "gpt_5_mini"
  | "gpt_5_4"
  | "gpt_5_5"
  | "gemini_3_flash"
  | "gemini_3_1_pro"
  | "claude_sonnet_4_6"
  | "claude_opus_4_6"
  | "claude_opus_4_7"
  | "claude_opus_4_8"
  | "claude-sonnet-5";

export interface AIModelConfig {
  id: ModelId;
  name: string;
  provider: string;
  description: string;
  premium: boolean;
  supportsWebSearch?: boolean;
  supportsVision?: boolean;
}

export const AI_MODELS: Record<ModelId, AIModelConfig> = {
  automatic: {
    id: "automatic",
    name: "Automatic",
    provider: "System",
    description: "Automatically selects the best model for your request",
    premium: false,
  },
  gpt_5_mini: {
    id: "gpt_5_mini",
    name: "GPT-5 Mini",
    provider: "OpenAI",
    description: "Fast and efficient for everyday tasks",
    premium: false,
  },
  gpt_5_4: {
    id: "gpt_5_4",
    name: "GPT-5.4",
    provider: "OpenAI",
    description: "Balanced performance and quality",
    premium: true,
  },
  gpt_5_5: {
    id: "gpt_5_5",
    name: "GPT-5.5",
    provider: "OpenAI",
    description: "Most capable OpenAI model",
    premium: true,
  },
  gemini_3_flash: {
    id: "gemini_3_flash",
    name: "Gemini 3 Flash",
    provider: "Google",
    description: "Fast with web search capabilities",
    premium: false,
    supportsWebSearch: true,
  },
  gemini_3_1_pro: {
    id: "gemini_3_1_pro",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    description: "Advanced reasoning with web search",
    premium: true,
    supportsWebSearch: true,
  },
  claude_sonnet_4_6: {
    id: "claude_sonnet_4_6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    description: "Excellent for coding and analysis",
    premium: true,
  },
  claude_opus_4_6: {
    id: "claude_opus_4_6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    description: "Most capable Anthropic model",
    premium: true,
  },
  claude_opus_4_7: {
    id: "claude_opus_4_7",
    name: "Claude Opus 4.7",
    provider: "Anthropic",
    description: "Next-gen reasoning model",
    premium: true,
  },
  claude_opus_4_8: {
    id: "claude_opus_4_8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    description: "Latest cutting-edge model",
    premium: true,
  },
  "claude-sonnet-5": {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    description: "Newest Sonnet with enhanced capabilities",
    premium: true,
  },
};

export const DEFAULT_MODEL: ModelId = "automatic";

export const SYSTEM_PROMPT = `You are HackerAI, an elite AI coding assistant embedded in a developer platform.
You help users write, debug, and understand code across multiple languages.
Always provide clear, well-structured responses with code blocks when relevant.
When explaining concepts, be concise but thorough. Use markdown formatting.
If the user shares code, analyze it carefully and provide actionable feedback.`;