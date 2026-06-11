import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: '/tardedivertida/',
  plugins: [
    react(),
    commonjs(),
    svgr({
      include: [
        'src/**/*.svg',
      ],
    }),
    // Only run checker in dev mode, not during production builds
    ...(process.env.NODE_ENV !== 'production' ? [
      checker({
        typescript: {
          tsconfigPath: 'tsconfig.json',
          buildMode: false,
        },
      }),
    ] : []),
  ],
  server: {
    open: true, // automatically open the app in the browser
    port: 3000,
  },
  resolve: {
    alias: {
      screens: path.resolve(__dirname, './src/screens'),
      styles: path.resolve(__dirname, 'src/styles'),
    },
    tsconfigPaths: true,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splitting for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            return 'vendor';
          }
          // Icons chunking
          if (id.includes('src/icons/') && id.endsWith('Icon.tsx')) {
            return 'icons';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
