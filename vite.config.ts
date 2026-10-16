import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    sourcemap: false,
  },
  ssr: {
    // Bundle these into the prerender build so Node can import it without ESM/CJS issues.
    noExternal: ['react-router-dom', 'react-router', '@remix-run/router'],
  },
});
