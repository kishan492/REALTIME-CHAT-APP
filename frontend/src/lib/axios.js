import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : "https://realtime-chat-app-snwy.onrender.com/api",
  withCredentials: true, // 🔥 this is critical for cookies
});