import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            twiq: resolve(__dirname, '../../../src/twiq.ts'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'esnext',
    },
});
