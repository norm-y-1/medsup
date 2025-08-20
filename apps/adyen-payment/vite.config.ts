import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'adyen_payment',
      filename: 'remoteEntry.js',
      exposes: {
        './AdyenPaymentApp': './src/components/AdyenPaymentApp.tsx'
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
    port: 3002,
    cors: true,
    // Add proxy to handle CORS issues with Adyen services in development
    proxy: {
      '/checkoutanalytics': {
        target: 'https://checkoutanalytics-test.adyen.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/checkoutanalytics/, '/checkoutanalytics')
      }
    }
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
