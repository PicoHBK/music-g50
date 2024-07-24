/** @type {import('tailwindcss').Config} */
import { theme as customTheme } from './src/assets/theme.js';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...customTheme.colors, 
      },
      fontFamily: {
        ...customTheme.fontFamily,
      },
      
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}