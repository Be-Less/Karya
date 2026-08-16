import Task from "../models/task.model.js";

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
    userId : req.user.userId
  })
  res.status(200).json({
    tasks
  })
};
