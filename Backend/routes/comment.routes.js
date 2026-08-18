import express from "express";
import { createComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:taskId/comments", authMiddleware, createComment);

export default router;
