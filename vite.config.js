import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        actividades: resolve(__dirname, 'actividades.html'),
        cursos: resolve(__dirname, 'cursos.html'),
        galeria: resolve(__dirname, 'galeria.html'),
        'aviso-legal': resolve(__dirname, 'aviso-legal.html'),
        privacidad: resolve(__dirname, 'privacidad.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        '404': resolve(__dirname, '404.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
