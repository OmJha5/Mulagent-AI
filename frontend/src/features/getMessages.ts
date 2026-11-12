import type { IMessage } from "@/redux/messageSlice";
import { api } from "@/utils/axios";

async function getMessages(conversationId: string): Promise<IMessage[]> {
  try {
    const { data } = await api.get<{ messages?: IMessage[] }>(
      `/api/chat/messages/${conversationId}`,
    );
    return data.messages ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default getMessages;
