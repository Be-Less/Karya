import Task from "../models/task.model.js";
import mongoose from "mongoose";
export const createTask = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something Went WRONG",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.userId,
    });
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something Went WRONG",
    });
  }
};

export const getTask = async (req, res) => {
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
    console.log(error);
    res.status(500).json({
      message: "Something Went WRONG",
    });
  }
};

export const updateTask = async (req, res) => {
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
    console.log(error);
    res.status(500).json({
      message: "Something Went WRONG",
    });
  }
};

export const deleteTask = async (req, res) => {
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
    console.log(error);
    res.status(500).json({
      message: "Something Went WRONG",
    });
  }
};
