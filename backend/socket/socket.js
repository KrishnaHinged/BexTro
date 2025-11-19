// socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", (message) => {
    const { receiverId, senderId, content } = message;
    const receiverSocketId = getReceiverSocketId(receiverId);

    const messageData = {
      senderId,
      receiverId,
      content,
      createdAt: new Date(),
    };

    // Emit 'newMessage' instead of 'receiveMessage'
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageData);
    }
    io.to(socket.id).emit("newMessage", messageData);
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };