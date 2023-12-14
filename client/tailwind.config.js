/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors:{
        black: {
          focus: "#404249",
          hover: "#35373C",
          50: "#383A40",
          100: "#313338",
          200: "#2c2f33",
          300: "#232428",
          400: "#1E1F22"
        },
        gray: {
          100: "#B5BAC1",
          200: "#80848E"
        },
        blue: "#7289da"
      }
    },
  },
  plugins: [],
}

