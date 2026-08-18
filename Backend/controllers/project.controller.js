import Project from "../models/project.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

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
    next(error);
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

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.userId,
      },
      {
        name,
        description,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    const project = await Project.findOneAndDelete({
      _id: id,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
    const project = await Project.findOne({
      _id: id,
      owner: req.user.userId,
    });
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const alreadyMember = project.members.some(
      (member) => member.user.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User is already a member of this project",
      });
    }
    project.members.push({
      user: userId,
      role: "member",
    });
    await project.save();
    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};
export const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }
    const project = await Project.findOne({
      _id: id,
      owner: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const memberIndex = project.members.findIndex(
      (member) => member.user.toString() === userId,
    );
    if (memberIndex === -1) {
      return res.status(404).json({
        message: "User is not a member of this project",
      });
    }
    project.members.splice(memberIndex, 1);
    await project.save();
    res.status(200).json({
      message: "Member removed successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};
