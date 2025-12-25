/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066CC",
        secondary: "#F48024",
        success: "#5FA924",
        background: "#FFFFFF",
        surface: "#F8F9F9",
        border: "#D6D9DC",
        text: {
          primary: "#232629",
          secondary: "#6A737C",
        },
      },
    },
  },
  plugins: [],
}
