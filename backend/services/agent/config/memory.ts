import redis from "../../../shared/redis/redis.ts";
import { getConversationMessages } from "../utils/getConversationMessages.ts";

export const getConversationMemory = async (
  conversationId: string,
  userId: string,
) => {
  try {
    const key = `agent-messages-${conversationId}-${userId}`;

    const rawMessages = await redis.get(key);
    if (rawMessages) {
      return JSON.parse(rawMessages);
    }

    const messages = await getConversationMessages(conversationId, userId);

    // Logic to just fetch the last 20 messages
    const last20Messages = messages.slice(-20);

    await redis.set(key, JSON.stringify(last20Messages), "EX", 24 * 60 * 60);
    return last20Messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const addOneMessageToMemory = async (
  conversationId: string,
  userId: string,
  message: { role: string; content: string },
) => {
  try {
    const key = `agent-messages-${conversationId}-${userId}`;

    const rawMessages = await redis.get(key);
    if (rawMessages) {
      const messages = JSON.parse(rawMessages);
      // logic to just add one message to memory
      messages.push(message);
      const last20Messages = messages.slice(-20);
      await redis.set(key, JSON.stringify(last20Messages), "EX", 24 * 60 * 60);
      return;
    }

    await redis.set(key, JSON.stringify([message]), "EX", 24 * 60 * 60);
  } catch (error) {
    console.log(error);
  }
};
