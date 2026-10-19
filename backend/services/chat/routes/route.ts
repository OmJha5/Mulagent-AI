import express from "express";
import {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
} from "../controllers/conversation.controller.ts";
import {
  saveMessage,
  getMessages,
} from "../controllers/message.controller.ts";

const router = express.Router();

// Conversation Routes
router.post("/conversations", createConversation);
router.get("/conversations", getConversations);
router.put("/conversations/:id", updateConversation);
router.delete("/conversations/:id", deleteConversation);

// Message Routes
router.post("/messages", saveMessage);
router.get("/messages/:conversationId", getMessages);

export default router;