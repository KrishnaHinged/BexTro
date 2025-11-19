import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import leoProfanity from "leo-profanity";
import userRoutes from "./routes/userRoutes.js";
import userDataRoutes from "./routes/userDataRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import quotesRoutes from "./routes/quotesRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

// Initialize profanity filter
const filter = leoProfanity;
filter.add(["porn", "kill", "drugs", "violence"]);
console.log("Profanity filter initialized successfully");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/userdata", userDataRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/challenges", typeof challengeRoutes === "function" ? challengeRoutes(filter) : challengeRoutes);
app.use("/api/v1/quotes", quotesRoutes);
app.use("/api/v1", newsRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR] ", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server only if DB connects
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  });