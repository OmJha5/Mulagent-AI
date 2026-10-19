import axios from "axios";
import { type Request, type Response } from "express";
import { graph } from "../graph/graph.ts";

export const agent = async (req: Request, res: Response) => {
  try {
    const { prompt, conversationId } = req.body;

    await axios.post(`${process.env.CHAT_SERVICE_URL}/messages`, {
      conversationId,
      role: "user",
      content: prompt,
    });

    const result = await graph.invoke({
      prompt,
      conversationId,
    });

    const aiResponse = result.aiResponse;

    return res.status(200).json(aiResponse);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Agent error ${error}`,
    });
  }
};
