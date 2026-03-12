/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#dcae96',
          dark: '#c19a84',
          light: '#ebd8cd',
        }
      },
      fontFamily: {
        brand: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'fun': '0 4px 0 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
