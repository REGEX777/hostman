/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.{html,ejs,js}"],
  theme: {
    extend: {
      fontFamily: {
        "poppins": 'Poppins, sans-serif'
      },
      animation: {
        bounce: 'bounce 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}