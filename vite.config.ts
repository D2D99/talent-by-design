import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["talent-by-design.onrender.com"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("chart.js")) return "vendor-charts";
            if (id.includes("xlsx")) return "vendor-excel";
            if (id.includes("lottie")) return "vendor-lottie";
            if (id.includes("framer-motion")) return "vendor-framer";
            return "vendor";
          }
        },
      },
    },
  },
});
