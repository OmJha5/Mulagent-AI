import axios from "axios";

export const getConversationMessages = async (
  conversationId: string,
  userId: string,
) => {
  try {
    const result = await axios.get(
      `${process.env.CHAT_SERVICE_URL}/messages/${conversationId}`,
      {
        headers: {
          "x-user-id": userId,
        },
      },
    );
    return result?.data?.messages;
  } catch (error) {
    console.log("Error in fetching conversation messages :", error);
    return [];
  }
};
