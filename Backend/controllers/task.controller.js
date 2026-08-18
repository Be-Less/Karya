import Task from "../models/task.model.js";
import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, priority } =
      req.body;

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
      assignedTo,
      dueDate,
      priority,
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
    const { status, priority } = req.query;
    // console.log(status);
    if (status && !["todo", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority",
      });
    }
    const projects = await Project.find({
      "members.user": req.user.userId,
    });
    const projectIds = projects.map((project) => project._id);
    const filter = {
      projectId: { $in: projectIds },
    };
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    const tasks = await Task.find(filter);

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
    const task = await Task.findById(id);
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
    const { title, description, status, dueDate, priority } = req.body;

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
        dueDate,
        priority,
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
