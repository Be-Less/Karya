import express from "express";
import dotenv from "dotenv";
dotenv.config();
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
const allowedOrigins = [
  'https://karya-frontend.onrender.com',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight across all routes

// 2. Body parsing middleware
app.use(express.json());

console.log("🔥 KARYA BACKEND VERSION: SWAGGER ENABLED");

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


app.get("/", (req, res) => {
  res.send("Welcome to Karya");
});

// Calling connectDB function to establish a connection to the MongoDB database
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
