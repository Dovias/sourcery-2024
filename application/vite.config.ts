import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import { svgSpritemap } from 'vite-plugin-svg-spritemap';

export default defineConfig({
    build: {
        outDir: 'build',
        // we use postcss's css nano to minify, so we should ignore Vite's attempts to minify
        cssMinify: false,
        rollupOptions: {
            output:{
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                }
            }
        }
    },
    plugins: [
        react(),
        eslint(),
        svgSpritemap({
            pattern: 'src/icons/*.svg',
            filename: 'icons.svg'
        })
    ],
})