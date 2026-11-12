export const agentLabel = {
  auto: "auto",
  chat: "chat",
  coding: "coding",
  pdf: "pdf",
  ppt: "ppt",
  vision: "vision",
  search: "search",
  // Below are not the real agents but are something which are just use to call groq model and extract information
  intent: "intent",
} as const;

export const codingIntent = {
  codeGeneration: "CODE_GENERATION",
  codeReview: "CODE_REVIEW",
  codeExplanation: "CODE_EXPLANATION",
  debugging: "DEBUGGING",
  optimization: "OPTIMIZATION",
  conversion: "CONVERSION",
  documentation: "DOCUMENTATION",
} as const;

export const artifactType = {
  project: "Project",
} as const;

export const codingLlmConfig = {
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 8192,
} as const;

export const codingJsonResponseFormat = {
  type: "json_object",
} as const;

export const visionConfig = {
  pollinationsBaseUrl: "https://gen.pollinations.ai/image",
  pollinationsModel: "flux",
  imageRequestTimeoutMs: 60_000, // Aborts the request if image is not generated within 60_000 ms = 60 seconds
  signedUrlExpiresInMinutes: 1440, // 24 hours
} as const;
