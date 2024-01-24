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
  build: {
    sourcemap: true
  },
  define: {
    "process.env": process.env
  },
  resolve: {
    alias: {
      'jsonld': 'jsonld/dist/jsonld.js',
      '@components': '/src/components',
      '@styles': '/src/styles',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@models': '/src/models'
    },
  },
});