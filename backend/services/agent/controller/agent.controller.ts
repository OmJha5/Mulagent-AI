import axios from "axios";
import { type Request, type Response } from "express";
import { graph } from "../graph/graph.ts";
import { addOneMessageToMemory } from "../config/memory.ts";

export const agent = async (req: Request, res: Response) => {
  try {
    const { prompt, conversationId, agent } = req.body;
    console.log(prompt, conversationId, agent);

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
      agent,
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
      });
    }

    return res.status(200).json({
      botResponse: aiResponse,
      images: result.searchImages || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Agent error ${error}`,
    });
  }
};
