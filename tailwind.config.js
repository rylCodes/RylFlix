/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./public/**/*.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myViolet: "#8B5CF6",
      },
    },
  },
  plugins: [],
};
