import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { exec } from 'child_process';
import { promisify } from 'util';

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
    },
  },
  define: {
    'process.env': {},
    __VERSION__: JSON.stringify(
      (await promisify(exec)('git rev-parse --short HEAD')).stdout.trim(),
    ),
  },
});
