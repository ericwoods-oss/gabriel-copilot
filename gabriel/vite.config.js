import { defineConfig } from 'vite';

export default defineConfig({
  base: '/gabriel-copilot/',
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
});
