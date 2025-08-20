import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        'adyen-payment': 'http://localhost:3000/remoteEntry.js'
      },
      shared: {
        react: {
          requiredVersion: '^19.1.1'
        },
        'react-dom': {
          requiredVersion: '^19.1.1'
        },
        effector: {
          requiredVersion: '^23.4.2'
        },
        'effector-react': {
          requiredVersion: '^23.3.0'
        }
      }
    })
  ],
  server: {
    port: 5173
  },
  build: {
    target: 'esnext'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
