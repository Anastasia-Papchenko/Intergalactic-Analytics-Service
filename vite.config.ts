import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/aggregate': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/report': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
