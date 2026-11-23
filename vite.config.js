import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import app from './server/app.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-api-server',
      configureServer(server) {
        server.middlewares.use(app)
      },
      configurePreviewServer(server) {
        server.middlewares.use(app)
      }
    }
  ],
})
