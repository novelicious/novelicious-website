/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D1D1D",
        secondary: "#71717a",
        neutral: "#f4f4f5",
      },
    },
  },
  plugins: [],
};
