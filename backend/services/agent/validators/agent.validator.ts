import { z } from "zod";
import { agentLabel } from "../constants/constants.ts";
import mongoose from "mongoose";

export const allowedAgentTypes = [
  agentLabel.auto,
  agentLabel.chat,
  agentLabel.coding,
  agentLabel.pdf,
  agentLabel.ppt,
  agentLabel.vision,
  agentLabel.search,
] as const;

export const conversationIdSchema = z
  .string({ message: "conversationId is required" })
  .trim()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid conversationId: must be a valid MongoDB ObjectId",
  });

export const agentRequestSchema = z.object({
  prompt: z
    .string({ message: "Prompt is required" })
    .trim()
    .min(1, { message: "Prompt cannot be empty" }),
  conversationId: conversationIdSchema,
  agent: z.enum(allowedAgentTypes).optional().default(agentLabel.auto),
});