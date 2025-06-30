import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public/build',
    rollupOptions: {
      input: {
        app: 'resources/js/app.js',
        style: 'resources/css/app.css'
      }
    }
  },
  server: {
    hmr: {
      host: 'localhost',
    },
  },
});