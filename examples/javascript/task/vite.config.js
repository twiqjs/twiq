import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '/dist/twiq.js': resolve(__dirname, '../../../dist/twiq.js')
    }
  },
  server: {
    fs: {
      allow: ['../../..']
    }
  }
});
