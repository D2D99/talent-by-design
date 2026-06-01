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
    host: "localhost",
    port: 5173,
    strictPort: false,
    allowedHosts: ["talent-by-design.onrender.com"],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.match(/[\\/]tw-elements[\\/]/)) {
              return "tw-elements";
            }
            if (id.match(/[\\/]highcharts[\\/]/)) {
              return "highcharts";
            }
            if (id.match(/[\\/](chart\.js|react-chartjs-2)[\\/]/)) {
              return "chartjs";
            }
            if (id.match(/[\\/]xlsx[\\/]/)) {
              return "xlsx";
            }
            if (id.match(/[\\/]framer-motion[\\/]/)) {
              return "framer-motion";
            }
            if (id.match(/[\\/]country-state-city[\\/]/)) {
              return "country-state-city";
            }
            if (id.match(/[\\/](lottie-react|lottie-web|@lottiefiles)[\\/]/)) {
              return "lottie-vendor";
            }
            if (
              id.match(
                /[\\/](axios|date-fns|react-toastify|react-tooltip)[\\/]/,
              )
            ) {
              return "utils-vendor";
            }
            if (id.match(/[\\/](react-dom|react-router-dom)[\\/]/)) {
              return "react-vendor";
            }
            return "vendor";
          }
        },
      },
    },
  },
});
