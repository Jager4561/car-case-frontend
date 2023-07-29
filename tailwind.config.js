/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'darkCyan': '#0D9488'
      },
      fontSize: {
        '2xs': '.625rem',
      },
      screens: {
        '3xl': '1600px',
      }
    },
  },
  plugins: [],
}
