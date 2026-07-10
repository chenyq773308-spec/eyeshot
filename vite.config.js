import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: "src/main.jsx",
      name: "EYESHOT",
      formats: ["iife"],
      fileName: () => "eyeshot-app.js",
      cssFileName: "eyeshot-app",
    },
  },
});
