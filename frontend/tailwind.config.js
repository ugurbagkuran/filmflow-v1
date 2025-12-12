/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914', // Netflix/IMDb like red
        secondary: '#141414', // Dark background
        surface: '#1F1F1F', // Slightly lighter dark for cards
        text: '#E5E5E5', // Light text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
