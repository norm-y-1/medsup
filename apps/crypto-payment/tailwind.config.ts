/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crypto: {
          bitcoin: '#f7931a',
          ethereum: '#627eea',
          primary: '#1e40af',
          secondary: '#64748b'
        }
      }
    },
  },
  plugins: [],
}
