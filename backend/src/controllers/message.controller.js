import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar=async(req,res)=>{
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}})
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar controller: ",error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        if (!userToChatId) {
            return res.status(400).json({ error: "User to chat ID is required" });
        }
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time

        // Return empty array instead of 404
        res.status(200).json(messages || []);
    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
        res.status(500).json({error:"Internal server error"});
    }
}
export const sendMessage = async(req,res)=>{
    try {
        const {text,image}=req.body;
        const{id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError.message);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in send message controller: ",error.message)
        res.status(500).json({error:"Internal server error"})
    }
};