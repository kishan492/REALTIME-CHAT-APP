//const express = require("express")
import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import mongoose from "mongoose";
import {connectdb} from "./lib/db.js"
import cors from "cors"
import {app, server, io} from "./lib/socket.js"; // Import the app and server from socket.js
import path from "path";


app.use(express.json({ limit: '10mb' })); //to extract the data from body in json format
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173", // dev
    "https://realtime-chat-app-gamma-peach.vercel.app" // production
  ];
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));
  
const __dirname = path.resolve();
// app.use((req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.url}`); // Debugging
//     console.log("Request Cookies:", req.cookies); // Debugging
//     next();
// });


dotenv.config()
const PORT = process.env.PORT;

app.get('/',(req,res)=>{
    res.send("welcome to the index page")
})
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
server.listen(PORT,()=>{
    console.log(`your application is running on port: http://localhost:${PORT} `)
    connectdb();
})

// Graceful Shutdown Logic
process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0);
    });
});