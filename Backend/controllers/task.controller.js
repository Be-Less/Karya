import Task from "../models/task.model.js";
import mongoose from "mongoose";
export const createTask = async (req, res) => {
  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    userId: req.user.userId,
  });
  res.status(201).json({
    message: "Task created Successfully",
    task,
  });
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find({
    userId: req.user.userId,
  });
  res.status(200).json({
    tasks,
  });
};

export const getTask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      messaeg: "Invalid task ID",
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
};

export const updateTask = async (req, res) => {
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
};

export const deleteTask = async (req, res) => {
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
    return res.status(400).json({
      message: "Task not found",
    });
  }

  res.status(200).json({
    message: "Task deleted successfully",
  });
};
