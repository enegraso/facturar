import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3008",
      "/companies": "http://localhost:3008",
      "/invoice": "http://localhost:3008",
    },
  },
});
