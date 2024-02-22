import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: "",
  root: "",
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
  envPrefix: 'FTA_FMEA_',
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