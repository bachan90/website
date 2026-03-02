/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#1B3A5C",
          900: "#102a43"
        },
        gold: {
          50: "#fdf8e8",
          100: "#f9ecbf",
          200: "#f0d98a",
          300: "#e5c454",
          400: "#C8A951",
          500: "#b8963a",
          600: "#9a7b2d",
          700: "#7c6223",
          800: "#5e4a1a",
          900: "#3f3112"
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
