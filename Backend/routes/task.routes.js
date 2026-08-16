import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import validateTask from "../middleware/validateTask.middleware.js";
import validateTaskUpdate from "../middleware/validateTaskUpdate.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateTask, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTask);
router.put("/:id", authMiddleware, validateTaskUpdate, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
