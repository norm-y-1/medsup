import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'crypto_payment',
      filename: 'remoteEntry.js',
      exposes: {
        './CryptoPaymentApp': './src/components/CryptoPaymentApp.tsx'
      },
      shared: {
        react: {
          requiredVersion: '^19.1.1'
        },
        'react-dom': {
          requiredVersion: '^19.1.1'
        }
      }
    })
  ],
  server: {
    port: 3001,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
