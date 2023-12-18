/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontSize: {
        'ssm': '10px',
      },
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
        blue: {
          50: "#5865F2",
          100: "#4D5AEF",
          200: "#4e5bec",
        }
      }
    },
  },
  plugins: [],
}

