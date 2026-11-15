export interface IPlan {
  id: "free" | "starter" | "pro";
  name: string;
  amount: number; // in INR
  credits: number;
  validityDays: number;
  features: string[];
}

export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 100,
    validityDays: 30,
    features: [
      "100 Credits",
      "Access to standard AI agents",
      "Community Support",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    amount: 199,
    credits: 500,
    validityDays: 30,
    features: [
      "500 Credits",
      "Access to all AI agents",
      "Priority Processing",
      "Standard Support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    amount: 499,
    credits: 1000,
    validityDays: 30,
    features: [
      "1000 Credits",
      "Access to all AI agents",
      "Highest Priority Processing",
      "Dedicated Support",
    ],
  },
} as const;

export const allowedPlans = ["free", "starter", "pro"] as const;
export type PlanId = (typeof allowedPlans)[number];

export const paymentStatuses = ["created", "paid", "failed"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const billingConfig = {
  currency: "INR",
  defaultReceiptPrefix: "receipt",
  internalSecretHeader: "x-internal-secret",
} as const;
