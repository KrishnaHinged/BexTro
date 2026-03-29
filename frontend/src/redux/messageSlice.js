import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    addMessage: (state, action) => {
      if (!state.messages) {
        state.messages = [action.payload];
        return;
      }
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index === -1) {
        state.messages.push(action.payload);
      }
    },
    replaceMessage: (state, action) => {
      const { tempId, newMessage } = action.payload;
      if (state.messages) {
        const index = state.messages.findIndex(m => m._id === tempId);
        if (index !== -1) {
          state.messages[index] = newMessage;
        }
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

export const { setMessages, addMessage, replaceMessage, markMessagesAsSeen } = messageSlice.actions;
export default messageSlice.reducer;
