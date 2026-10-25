import axios from "axios";
import { type Request, type Response } from "express";
import { graph } from "../graph/graph.ts";
import { addOneMessageToMemory } from "../config/memory.ts";

export const agent = async (req: Request, res: Response) => {
  try {
    const { prompt, conversationId } = req.body;

    const userId = req.headers["x-user-id"] as string;

    const chatClient = axios.create({
      baseURL: process.env.CHAT_SERVICE_URL,
      headers: { "x-user-id": userId },
    });

    await chatClient.post(`/messages`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
      userId,
    });

    const aiResponse = result.aiResponse;

    await addOneMessageToMemory(conversationId, userId, {
      role: "user",
      content: prompt,
    });

    await addOneMessageToMemory(conversationId, userId, {
      role: "assistant",
      content: aiResponse,
    });

    await chatClient.post(`/messages`, {
      conversationId,
      role: "assistant",
      content: aiResponse,
    });

    return res.status(200).json(aiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Agent error ${error}`,
    });
  }
};
