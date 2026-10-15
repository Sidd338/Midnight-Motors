import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Plugin to serve .html files on clean URLs in local dev (e.g. /what-is-a-hypercar -> /what-is-a-hypercar.html)
function cleanUrlsDevPlugin(): Plugin {
  return {
    name: 'clean-urls-dev-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && !req.url.includes('.') && req.url !== '/') {
          const [cleanPath, query] = req.url.split('?');
          const trimmed = cleanPath.replace(/^\//, '');
          const knownPages = [
            'what-is-a-hypercar',
            'best-classic-cars-to-invest-in',
            'luxury-motorcycles',
            'keyword-research'
          ];
          if (knownPages.includes(trimmed)) {
            req.url = `/${trimmed}.html` + (query ? `?${query}` : '');
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), cleanUrlsDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          whatIsAHypercar: path.resolve(__dirname, 'what-is-a-hypercar.html'),
          bestClassicCars: path.resolve(__dirname, 'best-classic-cars-to-invest-in.html'),
          luxuryMotorcycles: path.resolve(__dirname, 'luxury-motorcycles.html'),
          keywordResearch: path.resolve(__dirname, 'keyword-research.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
