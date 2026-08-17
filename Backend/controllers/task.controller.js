import Task from "../models/task.model.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      "members.user": req.user.userId,
    });
    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }
    if (!project) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }
    if (assignedTo) {
      const isMember = project.members.some(
        (member) => member.user.toString() === assignedTo,
      );

      if (!isMember) {
        return res.status(400).json({
          message: "Assigned user is not a member of this project",
        });
      }
    }
    const task = await Task.create({
      title,
      description,
      projectId,
      userId: req.user.userId,
    });
    res.status(201).json({
      message: "Task created Successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
    });
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
    const task = await Task.findOne({
      _id: id,
      userId: req.user.userId,
    });
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId,
      },
      {
        title,
        description,
        status,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.status(200).json({
      message: "Task updated Successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
