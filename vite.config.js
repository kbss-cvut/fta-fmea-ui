import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: "",
  plugins: [
    react(),
    envCompatible(),
    tsconfigPaths()
  ],
  define: {
    "process.env": process.env
  }
});