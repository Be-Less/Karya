import express from "express";
import { createTask, getTasks } from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",authMiddleware, createTask);
router.get("/",authMiddleware, getTasks);

export default router;