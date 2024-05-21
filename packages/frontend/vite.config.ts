import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()] as PluginOption[],
  resolve: {
    alias: {
      utils: '/src/utils',
      assets: '/src/assets',
      context: '/src/context',
      components: '/src/components',
      pages: '/src/pages',
      types: '/src/types',
    },
  },
  define: {
    'process.env': {},
  },
});
