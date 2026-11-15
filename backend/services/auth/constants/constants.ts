export const authConfig = {
  sessionTtlSeconds: 7 * 24 * 60 * 60, // 7 days
  sessionCookieMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
  defaultPlan: "free",
  defaultCredits: 100,
  planValidityDays: 30,
  internalSecretHeader: "x-internal-secret",
} as const;

export const allowedPlans = ["free", "starter", "pro"] as const;
export type AllowedPlan = (typeof allowedPlans)[number];

export const agentCreditCosts = {
  chat: 1,
  search: 5,
  coding: 10,
  pdf: 10,
  ppt: 10,
  vision: 10,
} as const;

export type AgentType = keyof typeof agentCreditCosts;
