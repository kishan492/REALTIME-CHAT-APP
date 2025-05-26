import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // keep this for local dev
      "https://realtime-chat-app-gamma-peach.vercel.app" // ← ADD THIS
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("User added to socket map:", userId, socket.id);
  }

  // io.emit() is used to send events to all the connected clients
  const onlineUsers = Object.keys(userSocketMap);
  console.log("Current online users:", onlineUsers);
  io.emit("getOnlineUsers", onlineUsers);

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      console.log("User removed from socket map:", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Handle reconnection
  socket.on("reconnect", (attemptNumber) => {
    console.log("User reconnected after", attemptNumber, "attempts");
    if (userId) {
      userSocketMap[userId] = socket.id;
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };