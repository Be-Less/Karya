import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import projectRoutes from "./routes/project.routes.js";

// Middleware to parse JSON request bodies
const app = express();
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Task management Routes
app.use("/api/tasks",taskRoutes);

// Project management Routes
app.use("/api/projects", projectRoutes);

app.use(errorHandler);
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