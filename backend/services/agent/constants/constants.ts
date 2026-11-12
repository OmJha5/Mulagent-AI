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
