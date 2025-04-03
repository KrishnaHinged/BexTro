import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userDataRoutes from "./routes/userDataRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import cors from "cors";
import path from "path";
import leoProfanity from "leo-profanity";
import quotesRoutes from "./routes/quotesRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

dotenv.config();

const filter = leoProfanity;
filter.add(["porn", "kill", "drugs", "violence"]);
console.log("filter initialized successfully");

const app = express();
const PORT = process.env.PORT || 5005;
app.use(express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/userdata", userDataRoutes);
app.use("/api/v1/challenges", typeof challengeRoutes === "function" ? challengeRoutes(filter) : challengeRoutes);
app.use("/api/v1/quotes", quotesRoutes);
app.use("/api/v1", newsRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR] ", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start Server Only if DB Connects
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  });