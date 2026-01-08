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
    host: '0.0.0.0',  // Ensure Vite binds to all available network interfaces
    port: 5173,        // Make sure this matches the port Render is expecting
  },
})