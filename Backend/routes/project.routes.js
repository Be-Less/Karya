import express from "express";
import {
  createProject,
  getProject,
  getProjects,
} from "../controllers/project.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProject);

export default router;
