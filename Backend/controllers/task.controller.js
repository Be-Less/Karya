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

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({
      messaeg:"Invalid task ID"
    })
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
