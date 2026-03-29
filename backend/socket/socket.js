// socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { User } from "../models/userModel.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    
    // Update Online Status
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      io.emit("userStatusUpdate", { userId, isOnline: true });
    } catch (err) {
      console.error("Socket: Error updating online status:", err.message);
    }
  }

  io.emit("onlineUsers", Object.keys(userSocketMap));

  // --- CHAT ENHANCEMENTS ---

  socket.on("sendMessage", (message) => {
    const { receiverId, senderId, content } = message;
    const receiverSocketId = getReceiverSocketId(receiverId);

    const messageData = {
      senderId,
      receiverId,
      content,
      isSeen: false,
      createdAt: new Date(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }
    io.to(socket.id).emit("newMessage", messageData);
  });

  // Typing Indicators
  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typingStatus", { senderId, isTyping });
    }
  });

  // Message Seen Receipt
  socket.on("markAsSeen", ({ senderId, receiverId }) => {
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { receiverId });
    }
  });

  socket.on("disconnect", async () => {
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];
      
      // Update Last Seen
      try {
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
        io.emit("userStatusUpdate", { userId, isOnline: false, lastSeen: new Date() });
      } catch (err) {
        console.error("Socket: Error updating last seen:", err.message);
      }
    }
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };