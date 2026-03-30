import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // <--- ESTE era el error, cámbialo a plugin-react
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Sistema de Fiados',
        short_name: 'FiadosApp',
        description: 'Gestión de inventario y cobros',
        theme_color: '#10b981',
        icons: [
          {
            src: 'pwa-192x192.png', // Asegúrate de tener estas imágenes en tu carpeta public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})