import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      if (state.messages) {
        state.messages = [...state.messages, action.payload];
      } else {
        state.messages = [action.payload];
      }
    },
    markMessagesAsSeen: (state, action) => {
      const { receiverId } = action.payload;
      if (state.messages) {
          state.messages = state.messages.map(msg => {
              if (String(msg.receiverId) === String(receiverId)) {
                  return { ...msg, isSeen: true };
              }
              return msg;
          });
      }
    }
  },
});

export const { setMessages, addMessage, markMessagesAsSeen } = messageSlice.actions;
export default messageSlice.reducer;
