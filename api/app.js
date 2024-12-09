import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import testRoutes from "./routes/test.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

import path from "path";

dotenv.config();
const __dirname = path.resolve();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/test", testRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

connectToMongoDB()
  .then(() => {
    app.listen(8800, () => {
      console.log("Server is running on port 8800!");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
