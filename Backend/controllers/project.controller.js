import Project from "../models/project.model.js";
import mongoose from "mongoose";
export const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

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
    });
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
export const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOne({
      _id: id,
      "members.user": req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    next(error);
  }
};
