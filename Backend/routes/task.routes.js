import express from "express";
import { createTask } from "../controllers/tasks.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/",authMiddleware, createTask);

export default router;