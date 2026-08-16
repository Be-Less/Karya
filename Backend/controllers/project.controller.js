import Project from "../models/project.model.js";

export const createProject = async (req, res, next) => {
  try {const { name, description } = req.body;

const project = await Project.create({
  name,
  description,
  owner: req.user.userId,
  members: [
    {
      user: req.user.userId,
      role: "owner",
    },
  ],
});
res.status(201).json({
  message: "Project created Successfully",
  project,
})
  } catch (error) {
    next(errro);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.userId,
    });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    next(error);
  }
};