import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3001,
      host: '0.0.0.0', // Binds to all network interfaces
    },
    plugins: [react(), basicSsl()],
    define: {
      // Expose env vars if needed, though VITE_ prefix works automatically
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Mobile performance optimizations
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug', 'console.warn'],
        },
      },
      cssMinify: true,
      rollupOptions: {
        output: {
          // Aggressive code splitting for better caching and smaller initial load
          manualChunks: (id) => {
            // React + React DOM in separate chunk
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor';
            }
            // PDF library in separate chunk (only loaded when needed)
            if (id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            // Components in separate chunks
            if (id.includes('/components/Cart')) {
              return 'cart-components';
            }
            if (id.includes('/components/Modal') || id.includes('/components/Popup')) {
              return 'modal-components';
            }
            // Utils and hooks
            if (id.includes('/hooks/') || id.includes('/utils/')) {
              return 'utils';
            }
          },
          // Better asset naming for caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 500, // Stricter limit for better performance
      // Asset optimization
      assetsInlineLimit: 4096, // Inline assets smaller than 4kb
      // Source maps only for errors (smaller build)
      sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'jspdf'],
    },
  };
});
