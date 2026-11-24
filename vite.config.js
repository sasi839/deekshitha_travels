import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import app from './server/app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    },
    {
      name: 'generate-200-html',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexFile = path.join(distDir, 'index.html')
        const fallbackFile = path.join(distDir, '200.html')
        if (fs.existsSync(indexFile)) {
          fs.copyFileSync(indexFile, fallbackFile)
          console.log('✓ Generated 200.html SPA fallback for Cloudflare Pages / Netlify')
        }
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react'
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase'
            }
          }
        }
      }
    }
  }
})
