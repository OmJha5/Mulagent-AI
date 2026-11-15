import axios from "axios";
import { type Request, type Response } from "express";
import { graph } from "../graph/graph.ts";
import { addOneMessageToMemory } from "../config/memory.ts";
import { agentRequestSchema } from "../validators/agent.validator.ts";

export const agent = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID is required",
      });
    }

    const validation = agentRequestSchema.safeParse(req.body);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue?.message || "Invalid request payload",
      });
    }

    const { prompt, conversationId, agent: requestedAgent } = validation.data;

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
      agent: requestedAgent,
    });

    const aiResponse = result.aiResponse;

    await addOneMessageToMemory(conversationId, userId, {
      role: "user",
      content: prompt,
    });

    if (aiResponse) {
      await addOneMessageToMemory(conversationId, userId, {
        role: "assistant",
        content: aiResponse,
      });

      await chatClient.post(`/messages`, {
        conversationId,
        role: "assistant",
        content: aiResponse,
        images: result.searchImages || [],
        artifacts: result.artifacts || [],
      });
    }

    return res.status(200).json({
      botResponse: aiResponse,
      images: result.searchImages || [],
      artifacts: result.artifacts || [],
    });
  } catch (error) {
    console.error("Error in agent controller:", error);
    const errorMessage =
      error instanceof Error ? error.message : `Agent error ${error}`;

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};
