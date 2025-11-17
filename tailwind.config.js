/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0F0F0F",
        darkAccent: "#DC9E00",
      },
    },
  },
  plugins: [],
};