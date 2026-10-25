import { createSlice } from "@reduxjs/toolkit";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

interface IUserConversationMessages {
  messages: IMessage[];
}

const initialState: IUserConversationMessages = {
  messages: [],
};
const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
