import {create} from 'zustand';

export const useThemeStore = create((set)=>({
    
    theme:localStorage.getItem("chat-theme") || "light",
    
    setTheme: (theme)=>{
        localStorage.setItem("chat-theme",theme);
        set({theme});
        //console.log(theme)
    }
}))

// import { create } from 'zustand';

// export const useThemeStore = create((set) => ({
//   theme: typeof window !== "undefined" && localStorage.getItem("chat-theme") 
//     ? localStorage.getItem("chat-theme") 
//     : "coffee", // Default to "coffee" if no theme is stored
//   setTheme: (theme) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("chat-theme", theme);
//     }
//     set({ theme });
//   },
// }));
