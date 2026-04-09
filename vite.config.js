import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    strictPort: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
  preview: {
    host: true,
    strictPort: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
  }
})
