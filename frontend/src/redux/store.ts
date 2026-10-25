import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userReducer from "./userSlice.ts";
import conversationReducer from "./conversationSlice.ts";
import messageReducer from "./messageSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversation: conversationReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
