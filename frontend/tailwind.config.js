/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui:{themes: ["dark","light","cupcake","retro","forest","aqua","lofi","wireframe","luxury","dracula",
    "business","autumn","acid","lemonade","coffee","night","winter","dim","nord","sunset"],},
}