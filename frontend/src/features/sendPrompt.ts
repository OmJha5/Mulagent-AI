import { api } from "@/utils/axios";

interface ISendPrompt {
  prompt: string;
  conversationId: string;
}

async function sendPrompt(payload: ISendPrompt) {
  try {
    const { data } = await api.post("/api/agent/chat", payload);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default sendPrompt;
