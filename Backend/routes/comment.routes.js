import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:taskId/comments", authMiddleware, createComment);
router.get("/:taskId/comments", authMiddleware, getComments);
router.put("/:taskId/comments/:commentId", authMiddleware, updateComment);
router.delete("/:taskId/comments/:commentId", authMiddleware, deleteComment);

export default router;
