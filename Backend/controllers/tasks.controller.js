import Task from "../models/task.model";

export const createTask = async (req,res) => {
  const { title, description } = req.body;

  const task = await Task.create({
    title,
    description,
    userId: req.user.userId
  });
  res.status(201).json({
    message: "Task created Successfully",
    task
  })
};

