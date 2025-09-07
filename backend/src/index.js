import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import { authroutes } from "./routes/auth.route.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use("/api/auth", authroutes);
app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  connectDB();
});
