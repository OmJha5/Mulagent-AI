import type { IArtifact } from "@/redux/messageSlice";
import { api } from "@/utils/axios";

export interface ISendPromptPayload {
  prompt: string;
  conversationId: string;
  agent: string;
}

export interface ISendPromptResponse {
  botResponse: string;
  images?: string[];
  artifacts?: IArtifact[];
}

async function sendPrompt(
  payload: ISendPromptPayload,
): Promise<ISendPromptResponse | null> {
  try {
    const { data } = await api.post<ISendPromptResponse>(
      "/api/agent/chat",
      payload,
    );
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default sendPrompt;
