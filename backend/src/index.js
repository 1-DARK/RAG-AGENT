import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  connectDB();
});
