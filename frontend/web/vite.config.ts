import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('framer-motion') || /\/motion\//.test(id)) {
            return 'vendor-motion'
          }
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts'
          if (id.includes('@reduxjs') || id.includes('react-redux')) {
            return 'vendor-redux'
          }
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            /\/react\//.test(id)
          ) {
            return 'vendor-react'
          }
          if (id.includes('lucide-react')) return 'vendor-icons'
          return undefined
        },
      },
    },
  },
})
