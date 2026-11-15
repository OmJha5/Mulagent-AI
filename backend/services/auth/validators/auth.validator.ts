import mongoose from "mongoose";
import { z } from "zod";
import {
  agentCreditCosts,
  allowedPlans,
  type AgentType,
} from "../constants/constants.ts";

export const objectIdSchema = z
  .string({ message: "userId is required" })
  .trim()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid userId: must be a valid MongoDB ObjectId",
  });

export const updatePaymentSchema = z.object({
  userId: objectIdSchema,
  plan: z.enum(allowedPlans, {
    message: `Invalid plan. Allowed plans: ${allowedPlans.join(", ")}`,
  }),
  credits: z
    .number({ message: "credits is required" })
    .int({ message: "credits must be an integer" })
    .positive({ message: "credits must be a positive number" }),
});

export const deductCreditsSchema = z.object({
  userId: objectIdSchema,
  agent: z.enum(
    Object.keys(agentCreditCosts) as [AgentType, ...AgentType[]],
    {
      message: `Invalid agent. Allowed agents: ${Object.keys(agentCreditCosts).join(", ")}`,
    },
  ),
});
