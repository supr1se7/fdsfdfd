
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '.replit.dev',
      '.repl.co'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1', 
      '0.0.0.0',
      '.replit.dev',
      '.repl.co'
    ]
  }
})
