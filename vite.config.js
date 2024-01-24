import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  base: "",
  plugins: [
    react(),
    envCompatible()
  ],
  define: {
    "process.env": process.env
  }
});