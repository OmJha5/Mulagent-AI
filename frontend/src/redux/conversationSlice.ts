import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Conversation {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ConversationState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
}

const initialState: ConversationState = {
  conversations: [],
  selectedConversation: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (
      state,
      action: PayloadAction<Conversation | null>,
    ) => {
      state.selectedConversation = action.payload;
    },
  },
});

export const { setConversations, addConversation, setSelectedConversation } =
  conversationSlice.actions;
export default conversationSlice.reducer;
