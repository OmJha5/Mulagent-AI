import { api } from "@/utils/axios";

export const createConversation = async () => {
  try {
    const { data } = await api.post("/api/chat/conversations");
    return data.conversation;
  } catch (error) {
    console.log(error);
    return [];
  }
};
