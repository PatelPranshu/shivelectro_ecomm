import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
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
            if (id.includes("@radix-ui")) return "radix-ui";
            if (id.includes("lucide-react")) return "lucide-react";
            if (id.includes("react-router-dom") || id.includes("@remix-run") || id.includes("react-router")) return "router";
            if (id.includes("@reduxjs") || id.includes("react-redux")) return "redux";
            if (id.includes("react") || id.includes("react-dom")) return "react-core";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
