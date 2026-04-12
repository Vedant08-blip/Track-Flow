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
    strictPort: false, // Allow auto-increment if port is in use
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
  preview: {
    host: true,
    strictPort: false, // Allow auto-increment if port is in use
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
  }
})
