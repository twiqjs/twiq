import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/twiq.ts',
      name: 'Twiq',
      fileName: 'twiq',
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      external: [],
    },
  },
});
