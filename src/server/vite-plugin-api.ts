import type { Plugin } from 'vite';
import { backendApp } from './app';

export function expressApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-express-api',
    configureServer(server) {
      server.middlewares.use('/api', (req, res, next) => {
        (backendApp as any)(req, res, next);
      });
    },
  };
}

