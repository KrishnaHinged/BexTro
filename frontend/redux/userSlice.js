import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null,
    role: null,
    OtherUsers: null,
    selectedUser: null,
    isAuthenticated: false,
    onlineUsers: null,
    feedbackList: [], // Add feedbackList to initial state
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      // Preserve feedbackList if it exists, otherwise initialize as empty
      state.feedbackList = state.feedbackList || [];
    },
    logoutUser: (state) => {
      state.authUser = null;
      state.role = null;
      state.isAuthenticated = false;
      state.feedbackList = []; // Reset feedback on logout, if desired
    },
    setOtherUser: (state, action) => {
      state.OtherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUser: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addFeedback: (state, action) => {
      state.feedbackList.unshift(action.payload); // Add new feedback to the start
    },
  },
});

export const { setAuthUser, logoutUser, setOtherUser, setSelectedUser, setOnlineUser, addFeedback } = userSlice.actions;
export default userSlice.reducer;