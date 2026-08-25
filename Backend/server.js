import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import projectRoutes from "./routes/project.routes.js";
import cors from "cors";
import commentRoutes from "./routes/comment.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Middleware to parse JSON request bodies
const app = express();
app.use(express.json());
app.use(cors());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Task management Routes
app.use("/api/tasks", taskRoutes);

// Project management Routes
app.use("/api/projects", projectRoutes);

app.use("/api/tasks", commentRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

// Load environment variables from .env file
dotenv.config();

app.get("/", (req, res) => {
  res.send("Welcome to Karya");
});

// Calling connectDB function to establish a connection to the MongoDB database
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
