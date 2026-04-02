import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Grouping React, Router, and Redux together to ensure hooks are available
            if (
              id.includes("react") || 
              id.includes("react-dom") || 
              id.includes("react-router") || 
              id.includes("@reduxjs")
            ) {
              return "framework";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});