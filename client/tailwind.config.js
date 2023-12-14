/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors:{
        black: {
          hover: "#3f4146",
          50: "#383A40",
          100: "#313338",
          200: "#2c2f33",
          300: "#232428",
          400: "#1E1F22"
        },
        gray: "#B5BAC1",
        blue: "#7289da"
      }
    },
  },
  plugins: [],
}

