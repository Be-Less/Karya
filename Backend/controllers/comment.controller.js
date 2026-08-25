import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";

export const createComment = async (req, res, next) => {
  try {
    console.log("createComment reached");
    const { taskId } = req.params;
    const { content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const project = await Project.findOne({
      _id: task.projectId,
      "members.user": req.user.userId,
    });

    if (!project) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }
    const comment = await Comment.create({
      content,
      taskId,
      userId: req.user.userId,
    });
    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(taskId).select("_id projectId");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      "members.user": req.user.userId,
    }).select("_id");

    if (!project) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const comments = await Comment.find({ taskId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ comments });
  } catch (error) {
    return next(error);
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { taskId, commentId } = req.params;
    const { content } = req.body;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const task = await Task.findById(taskId).select("_id projectId");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      "members.user": req.user.userId,
    }).select("_id");

    if (!project) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        taskId,
        userId: req.user.userId,
      },
      {
        content: content.trim(),
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { taskId, commentId } = req.params;

    if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        message: "Invalid comment ID",
      });
    }

    const task = await Task.findById(taskId).select("_id projectId");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      "members.user": req.user.userId,
    }).select("_id");

    if (!project) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const comment = await Comment.findOneAndDelete({
      _id: commentId,
      taskId,
      userId: req.user.userId,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};