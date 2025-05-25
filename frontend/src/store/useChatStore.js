import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get("/message/users")
            console.log("Fetched users:", res.data);
            set({ users: res.data })
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users")
        } finally {
            set({ isUserLoading: false })
        }
    },

    getMessages: async () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        
        set({ isMessagesLoading: true })
        try {
            const res = await axiosInstance.get(`/message/${selectedUser._id}`)
            console.log("Fetched messages:", res.data);
            set({ messages: res.data || [] })
        } catch (error) {
            console.error("Error fetching messages:", error);
            // Don't show error toast for empty messages
            if (error.response?.status !== 404) {
                toast.error(error.response?.data?.message || "Failed to fetch messages")
            }
            set({ messages: [] })
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }

        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.error("Socket not connected");
            return;
        }

        // Remove any existing listeners to prevent duplicates
        socket.off("newMessage");
    
        socket.on("newMessage", (newMessage) => {
            console.log("Received new message:", newMessage);
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            const isMessageSentByMe = newMessage.senderId === useAuthStore.getState().authUser?._id;
            
            if (isMessageSentFromSelectedUser || isMessageSentByMe) {
                set((state) => ({
                    messages: [...state.messages, newMessage]
                }));
            }
        });
    },
    
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },
    
    setSelectedUser: async (selectedUser) => {
        console.log("Setting selected user:", selectedUser);
        if (!selectedUser) return;

        // Unsubscribe from previous messages
        get().unsubscribeFromMessages();
        
        // Clear current messages
        set({ selectedUser, messages: [] });
        
        // Fetch messages for the new selected user
        await get().getMessages();
        
        // Subscribe to new messages
        get().subscribeToMessages();
    },
}))