import { type Request, type Response } from "express";
import { ZodError } from "zod";
import Message from "../models/message.model.ts";
import Conversation from "../models/conversation.model.ts";
import {
  saveMessageSchema,
  conversationIdParamSchema,
} from "../validators/chat.validator.ts";

const getUserIdFromHeader = (req: Request): string | null => {
  const userId = req.headers["x-user-id"];
  if (typeof userId === "string" && userId.trim().length > 0) {
    return userId.trim();
  }
  return null;
};

export const saveMessage = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing x-user-id header",
      });
    }

    const { conversationId, role, content } = saveMessageSchema.parse(req.body);

    // Verify conversation exists and belongs to the authenticated user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    // Create the message
    const message = await Message.create({
      conversationId,
      role,
      content,
    });

    // Touch conversation updatedAt so it appears at top of conversation lists
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { updatedAt: new Date() },
    });

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    console.error("saveMessage error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while saving message",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing x-user-id header",
      });
    }

    const { conversationId } = conversationIdParamSchema.parse(req.params);

    // Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid parameters",
        errors: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    console.error("getMessages error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching messages",
    });
  }
};
