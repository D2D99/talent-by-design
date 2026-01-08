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
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173,       // Make sure this matches the port Render expects
    allowedHosts: ['talent-by-design.onrender.com'], // Add this to allow the backend URL
  },
})