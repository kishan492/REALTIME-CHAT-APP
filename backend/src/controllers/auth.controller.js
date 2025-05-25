import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  //console.log("Request body:", req.body);
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "No field can be empty"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be of 6 character"
      });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "email already exist" });

    // generating hash code
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });
    

    if (newUser) {
      //generate jwt token here
      generateToken(newUser._id, res);
      console.log("JWT set in cookies for user:", newUser._id); // Debugging
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const {email,password} = req.body
  try {  
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({message:"invalid email credentials"})
    }
    const isPassword = await bcrypt.compare(password,user.password);
    if(!isPassword){
      return res.status(400).json({message:"invalid password credentials"})
    }
    const token = generateToken(user._id,res);
    console.log("JWT set in cookies for user:", user._id); // Debugging
    res.status(200).json({
      _id:user.id,
      fullName:user.fullName,
      email:user.email,
      profilePic:user.profilePic,
      token,
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(400).json({ message: "No active session to log out" });
    }
    res.cookie("jwt","",{maxAge:0,path:"/"})
    res.status(200).json({message:"logged out successfully"})
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" }); 
  }
};

export const updateProfile=async(req,res)=>{
  try {
    const {profilePic} =req.body;
    const userId = req.user._id;
    if(!profilePic){return res.status(400).json({message:"profile picture is required"})}

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    res.status(200).json(updatedUser )
  } catch (error) {
    console.log("Error in update profile", error.message);
    res.status(500).json({ message: "Internal server error" }); 
  }
}

export const checkAuth = async (req,res)=>{
  try {
    console.log('req.user:', req.user);
    const { _id, fullName, email, profilePic } = req.user; 
    res.status(200).json({ _id, fullName, email, profilePic });
  } catch (error) {
    console.log("Error in checkauth controller", error.message);
    res.status(500).json({ message: "Internal server error" }); 
  }
}

