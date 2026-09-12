/**
 * Vite Configuration - Configures build pipeline, dev server, and React JSX transformations.
 * Communicates with: @vitejs/plugin-react and Vite runtime.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});
