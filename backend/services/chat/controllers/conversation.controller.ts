import { type Request, type Response } from "express";
import { ZodError } from "zod";
import Conversation from "../models/conversation.model.ts";
import Message from "../models/message.model.ts";
import {
  createConversationSchema,
  conversationParamsSchema,
  updateConversationBodySchema,
} from "../validators/chat.validator.ts";

const getUserIdFromHeader = (req: Request): string | null => {
  const userId = req.headers["x-user-id"];
  if (typeof userId === "string" && userId.trim().length > 0) {
    return userId.trim();
  }
  return null;
};

export const createConversation = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing x-user-id header" });
    }

    const validatedData = createConversationSchema.parse(req.body || {});

    const conversation = await Conversation.create({
      userId,
      title: validatedData.title || "New Chat",
    });

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }

    console.error("createConversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating conversation",
    });
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing x-user-id header" });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("getConversations error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching conversations",
    });
  }
};

export const updateConversation = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing x-user-id header" });
    }

    // ID must come from route params (:id)
    const { id } = conversationParamsSchema.parse(req.params);
    const { title } = updateConversationBodySchema.parse(req.body);

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId },
      { title },
      { new: true, runValidators: true },
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }

    console.error("updateConversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating conversation",
    });
  }
};

export const deleteConversation = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing x-user-id header" });
    }

    // ID must come from route params (:id)
    const { id: conversationId } = conversationParamsSchema.parse(req.params);

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or access denied",
      });
    }

    // Cascade delete associated messages
    await Message.deleteMany({ conversationId });

    return res.status(200).json({
      success: true,
      message: "Conversation and associated messages deleted successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      });
    }

    console.error("deleteConversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting conversation",
    });
  }
};
