/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a3b8fc',
          400: '#7090f9',
          500: '#4365f3',
          600: '#2c47e8',
          700: '#2334d0',
          800: '#1e2ba7',
          900: '#1d2984',
          950: '#111750',
        },
      },
    },
  },
  plugins: [],
}
