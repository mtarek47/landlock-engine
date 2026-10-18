/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        govt: {
          green: '#006A4E',
          'green-dark': '#004137',
          'green-light': '#008A64',
          red: '#F42A41',
          gold: '#FCD116',
          paper: '#F5F5F0',
          border: '#C8C8B8',
        }
      },
      fontFamily: {
        bangla: ['Hind Siliguri', 'sans-serif'],
        sans: ['Inter', 'Hind Siliguri', 'sans-serif'],
      }
    }
  },
  plugins: []
}
