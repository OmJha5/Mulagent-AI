import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
  .string()
  .trim()
  .regex(objectIdRegex, "Invalid ObjectId format");

export const conversationParamsSchema = z.object({
  id: objectIdSchema,
});

export const createConversationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
});

export const updateConversationBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
});

export const saveMessageSchema = z.object({
  conversationId: objectIdSchema,
  role: z.enum(["user", "assistant"], {
    error: "Role must be either 'user' or 'assistant'",
  }),
  content: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .max(20000, "Message content cannot exceed 20,000 characters"),
});

export const conversationIdParamSchema = z.object({
  conversationId: objectIdSchema,
});
