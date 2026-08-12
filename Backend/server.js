import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

// Middleware to parse JSON request bodies
const app = express();
app.use(express.json());

// Register the auth routes
app.use("/api/auth", authRoutes);

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