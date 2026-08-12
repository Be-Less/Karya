import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to TaskForge😈");
});

// Calling connectDB function to establish a connection to the MongoDB database
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});