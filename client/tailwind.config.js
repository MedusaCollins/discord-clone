/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors:{
        primary: "#202020",
        secondary: {
          100: "#e2e2d5",
          200: "#888883"
        }
      }
    },
  },
  plugins: [],
}

