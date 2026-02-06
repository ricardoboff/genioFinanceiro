import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Desativado para produção por segurança
    minify: 'esbuild'
  },
  server: {
    port: 3000
  }
});