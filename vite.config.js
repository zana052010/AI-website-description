import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base keeps every asset resolvable on GitHub Pages project sites.
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
