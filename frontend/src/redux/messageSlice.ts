import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MessageRole } from "@/constants/constants";

export interface IArtifactFile {
  name: string;
  content: string;
}

export interface IArtifact {
  id: number;
  type: string;
  title: string;
  files: IArtifactFile[];
}

export interface IMessage {
  role: MessageRole;
  content: string;
  images: string[];
  artifacts?: IArtifact[];
}

interface IUserConversationMessages {
  messages: IMessage[];
  artifacts: IArtifact[];
}

const initialState: IUserConversationMessages = {
  messages: [],
  artifacts: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    setArtifacts: (state, action: PayloadAction<IArtifact[]>) => {
      state.artifacts = action.payload;
    },
  },
});

export const { setMessages, addMessage, setArtifacts } = messageSlice.actions;
export default messageSlice.reducer;
