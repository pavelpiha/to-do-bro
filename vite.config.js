import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' || mode === 'development';

  if (isDev) {
    // Development configuration - preserve source structure
    return {
      plugins: [react()],
      base: './',
      build: {
        outDir: 'dist',
        emptyOutDir: false, // Preserve copied assets
        rollupOptions: {
          input: {
            popup: resolve(__dirname, 'popup.html'),
          },
          output: {
            entryFileNames: 'assets/[name].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name].[ext]',
            inlineDynamicImports: true, // Bundle everything into single files
          },
          external: [], // Don't externalize anything
          preserveEntrySignatures: 'strict',
        },
        minify: false,
        sourcemap: 'inline',
        target: 'esnext',
        modulePreload: false,
      },
      esbuild: {
        keepNames: true, // Preserve function and class names
      },
      define: {
        global: 'globalThis',
      },
    };
  } else {
    // Production configuration - optimized bundle
    return {
      plugins: [react()],
      base: './',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            popup: resolve(__dirname, 'popup.html'),
          },
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
            manualChunks: {
              vendor: ['react', 'react-dom'],
            },
          },
        },
        minify: 'terser',
        sourcemap: false,
        target: 'es2020',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      },
      define: {
        global: 'globalThis',
      },
    };
  }
});
