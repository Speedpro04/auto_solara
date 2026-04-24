import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/',
  server: {
    port: 3005,
    host: true
  },
  preview: {
    allowedHosts: ['auto.axoshub.com', 'localhost'],
    port: 3005,
    host: true
  },
  resolve: {
    alias: {
      'framer-motion': '/src/lib/mock-framer-motion.ts'
    }
  }
})
