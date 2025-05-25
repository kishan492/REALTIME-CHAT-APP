import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    socket:null,
    onlineUsers:[],
    isCheckingAuth:true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            console.log("Response from /auth/check:", res);
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth: from store",error.response || error)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async(data)=>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created Successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");           
        }finally{
            set({isSigningUp:false})
        }
    },
    login: async(data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");   
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout: async()=>{
        try {
            await axiosInstance.post('/auth/logout')
            get().disconnectSocket();
            set({authUser:null, onlineUsers: []})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("profile is updated successfully")
        } catch (error) {
            console.log("error in update profile:",error)
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling']
        });
        
        socket.on("connect", () => {
          console.log("Socket connected successfully");
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          toast.error("Connection error. Please try again later.");
        });

        socket.on("getOnlineUsers", (userIds) => {
          console.log("Received online users:", userIds);
          set({ onlineUsers: userIds });
        });

        socket.connect();
        set({ socket: socket });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.off("getOnlineUsers");
            socket.off("connect_error");
            socket.off("connect");
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    },
}))