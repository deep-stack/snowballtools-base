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
  optimizeDeps: {
    include: [
      // "@snowballtools/types",
      // "@snowballtools/utils",
      // "@snowballtools/auth",
      // "@snowballtools/auth-lit",
      // "@snowballtools/smartwallet-alchemy-light",
      // "@snowballtools/link-lit-alchemy-light",
      // "@snowballtools/js-sdk",
    ],
  },
  define: {
    'process.env': 'import.meta.env',
  },
});
