import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react()
  ],

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Keep core vendor dependencies out of the initial app entry without changing UI code.
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return;
          if (id.includes("/node_modules/@base44/")) return "vendor-base44";
          if (id.includes("/node_modules/@supabase/")) return "vendor-supabase";
          if (id.includes("/node_modules/react-router/") || id.includes("/node_modules/react-router-dom/")) return "vendor-router";
        },
      },
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
