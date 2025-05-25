import mongoose from "mongoose";
import User from "./user.model.js";

const userSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:User,
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:User,
  },
  text:{
    type:String,
  },
  image:{
    type:String,
    
  },
},
{timestamps:true}
);

const Message = mongoose.model("Messages", userSchema);


export default Message;
