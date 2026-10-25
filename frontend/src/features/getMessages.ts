import { api } from "@/utils/axios";

async function getMessages(conversationid: string) {
  try {
    const { data } = await api.get(`/api/chat/messages/${conversationid}`);
    return data.messages;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default getMessages;
