import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['talent-by-design.onrender.com'],
  },
  build: {
    // Make sure to minify and clean up the production build properly
    minify: 'esbuild',  // Default minifier
    sourcemap: false,  // Avoid sourcemaps in production
  },
})