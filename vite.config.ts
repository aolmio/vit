import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Sets the base path to your repository name for GitHub Pages deployment
  base: '/vit/',
  
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      // Sets up the '@' alias to point to the root directory
      '@': path.resolve(__dirname, '.'),
    }
  },
  
  build: {
    // Standard output directory for production builds
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
