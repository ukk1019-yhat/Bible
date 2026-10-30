import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-latest-video',
      configureServer(server) {
        server.middlewares.use('/api/latest-video', async (_req, res) => {
          try {
            // @ts-expect-error Dynamic import of local API handler
            const { default: apiHandler } = await import('./api/latest-video.js')
            await apiHandler(_req, res)
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: String(err) }))
          }
        })
      },
    },
  ],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    assetsInlineLimit: 1024,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        // Keep the framework in one cacheable chunk; let route chunks stay small.
        manualChunks(id) {
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/react')) return 'react'
          return undefined
        },
      },
    },
  },
})
