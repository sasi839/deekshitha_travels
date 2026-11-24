import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import app from './server/app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SEO_ROUTES = [
  {
    path: 'services',
    title: 'Taxi Services & Car Rental Packages in Tirupati | Deekshitha Travels',
    description: 'Explore 24/7 taxi services in Tirupati, Tirumala darshan packages, airport transfers, and car rentals. Transparent pricing with courteous drivers. Call +91 6300540826.',
    canonical: 'https://deekshithatravels.com/services',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  {
    path: 'vehicles',
    title: 'Our Vehicle Fleet - Sedan, Innova, Tempo Traveller | Deekshitha Travels',
    description: 'Choose from our verified fleet: Swift Dzire, Ertiga, Innova Crysta, Etios, and Tempo Traveller in Tirupati. Clean AC cabs for families and groups. Call +91 6300540826.',
    canonical: 'https://deekshithatravels.com/vehicles',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  {
    path: 'locations',
    title: 'Popular Destinations & Service Locations | Deekshitha Travels',
    description: 'Doorstep taxi pickup across Tirupati, Tirumala, Renigunta, Tirupati Airport, Srikalahasti, Kanipakam, and Vellore. Reliable outstation cabs. Call +91 6300540826.',
    canonical: 'https://deekshithatravels.com/locations',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  {
    path: 'about',
    title: 'About Deekshitha Travels | Trusted Taxi Agency in Tirupati',
    description: 'Learn about Deekshitha Travels, your trusted travel partner for 24/7 cabs, Tirumala temple darshan, and airport transfers in Tirupati. Call +91 6300540826.',
    canonical: 'https://deekshithatravels.com/about',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  {
    path: 'contact',
    title: 'Book a Taxi - Contact & Online Reservation | Deekshitha Travels',
    description: 'Book your Tirupati cab online or via WhatsApp. Zero advance required, instant driver allotment, and transparent fares. Call +91 6300540826.',
    canonical: 'https://deekshithatravels.com/contact',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  },
  {
    path: 'admin',
    title: 'Admin Portal | Deekshitha Travels',
    description: 'Administrative access portal for Deekshitha Travels.',
    canonical: 'https://deekshithatravels.com/admin',
    robots: 'noindex, nofollow'
  }
]

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
      name: 'generate-seo-and-fallback-html',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexFile = path.join(distDir, 'index.html')
        const fallbackFile = path.join(distDir, '200.html')

        if (fs.existsSync(indexFile)) {
          // Cloudflare Pages / Netlify fallback
          fs.copyFileSync(indexFile, fallbackFile)
          console.log('✓ Generated 200.html SPA fallback for Cloudflare Pages / Netlify')

          const baseHtml = fs.readFileSync(indexFile, 'utf8')

          // Generate static SEO-optimized landing pages for crawlers and direct navigation
          SEO_ROUTES.forEach((route) => {
            const routeDir = path.join(distDir, route.path)
            if (!fs.existsSync(routeDir)) {
              fs.mkdirSync(routeDir, { recursive: true })
            }

            let modifiedHtml = baseHtml
              .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
              .replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/, `<meta name="title" content="${route.title}" />`)
              .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${route.description}" />`)
              .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/, `<link rel="canonical" href="${route.canonical}" />`)
              .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/, `<meta property="og:title" content="${route.title}" />`)
              .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/, `<meta property="og:description" content="${route.description}" />`)
              .replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/, `<meta property="og:url" content="${route.canonical}" />`)
              .replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${route.title}" />`)
              .replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${route.description}" />`)
              .replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/, `<meta name="twitter:url" content="${route.canonical}" />`)
              .replace(/<meta\s+name="robots"\s+content=".*?"\s*\/?>/, `<meta name="robots" content="${route.robots}" />`)

            fs.writeFileSync(path.join(routeDir, 'index.html'), modifiedHtml, 'utf8')
            console.log(`✓ Generated static SEO entry: /${route.path}/index.html (${route.robots.includes('noindex') ? 'noindex' : 'indexable'})`)
          })
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
