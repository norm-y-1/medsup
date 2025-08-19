import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: [],
} satisfies Config
