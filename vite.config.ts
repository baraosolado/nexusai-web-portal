import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    minify: 'terser',
    rollupOptions: {
      external: ['@splinetool/runtime'],
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        manualChunks: (id) => {
          // Separa todas as dependências do Spline em chunks separados
          if (id.includes('@splinetool/react-spline')) {
            return 'spline-react';
          }
          // Runtime será carregado dinamicamente, não no bundle
          if (id.includes('@splinetool/runtime')) {
            return 'spline-runtime';
          }
          
          // Physics/3D libraries em chunk separado
          if (id.includes('physics') || id.includes('cannon') || id.includes('ammo')) {
            return 'physics-engine';
          }
          
          // Bibliotecas de UI em chunks menores
          if (id.includes('@radix-ui/react-dialog') || id.includes('@radix-ui/react-accordion')) {
            return 'radix-core';
          }
          if (id.includes('@radix-ui')) {
            return 'radix-ui';
          }
          
          // Core React
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // Framer Motion
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          
          // Utilitários
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // Todas as outras dependências node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  },
}));
