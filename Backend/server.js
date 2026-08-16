import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

// Middleware to parse JSON request bodies
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/tasks",taskRoutes);
// Load environment variables from .env file
dotenv.config();

app.get("/", (req, res) => {
  res.send("Welcome to TaskForge😈");
});

// Calling connectDB function to establish a connection to the MongoDB database
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});