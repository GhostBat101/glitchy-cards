/**
 * Vite Configuration - Configures build pipeline, dev server, relative base for GitHub Pages, and React JSX transformations.
 * Communicates with: @vitejs/plugin-react and Vite runtime.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});
