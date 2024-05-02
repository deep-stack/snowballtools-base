import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      utils: '/src/utils',
      assets: '/src/assets',
      context: '/src/context',
      components: '/src/components',
    },
  },
  define: {
    'process.env': {},
  },
  build: {
    sourcemap: true,
  },
});
