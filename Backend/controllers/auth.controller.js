import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req,res) => {
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "Invalid email or password"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(400).json({message: "Invalid email or password"});
    }
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );
    res.status(200).json({
      message: "Login successful",
      token,
    });
  }
  catch(error){
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}


