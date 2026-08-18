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
