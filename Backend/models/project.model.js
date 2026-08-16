import mongoose, { mongo } from "mongoose";

const projectSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    trim: true,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  members: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
  },
],
}, 
{
  timestamps: true,
});

const Project = mongoose.model("Project",projectSchema);

export default Project;