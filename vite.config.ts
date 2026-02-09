
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Permite que o código acesse process.env.API_KEY no navegador
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  },
  server: {
    port: 3000
  }
});
