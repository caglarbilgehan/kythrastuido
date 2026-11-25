import http from 'node:http';
import https from 'node:https';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8001';

function sendOfflineFallback(urlPath: string, method: string, res: http.ServerResponse) {
  if (res.headersSent) {
    res.end();
    return;
  }
  const cleanPath = urlPath.split('?')[0];
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Kythra-Backend-Status', 'offline');

  if (method === 'GET') {
    if (cleanPath === '/api/workbench/library') {
      res.statusCode = 200;
      res.end(JSON.stringify({ songs: [] }));
      return;
    }
    if (cleanPath === '/api/workbench/studio-bundle') {
      res.statusCode = 200;
      res.end(JSON.stringify({ state: { has_session: false, stages: {} } }));
      return;
    }
    if (cleanPath === '/api/workbench/auth/me') {
      res.statusCode = 200;
      res.end(JSON.stringify({ authenticated: false, user: null, favorites: [], private_uploads: [] }));
      return;
    }
    if (cleanPath === '/api/workbench/session' || cleanPath === '/api/workbench/state') {
      res.statusCode = 200;
      res.end(JSON.stringify({ state: { has_session: false, stages: {} } }));
      return;
    }
  }

  res.statusCode = 503;
  res.end(JSON.stringify({ detail: 'Backend API (127.0.0.1:8001) is not running in this environment.' }));
}

function resilientApiProxy(): Plugin {
  const target = new URL(API_PROXY_TARGET);
  const client = target.protocol === 'https:' ? https : http;

  return {
    name: 'kythra-resilient-api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = req.url || '';
        if (!reqUrl.startsWith('/api')) {
          return next();
        }

        const method = (req.method || 'GET').toUpperCase();
        const headers: http.OutgoingHttpHeaders = { ...req.headers, host: target.host };

        const upstreamReq = client.request(
          {
            protocol: target.protocol,
            hostname: target.hostname,
            port: target.port || (target.protocol === 'https:' ? 443 : 80),
            path: reqUrl,
            method,
            headers
          },
          (upstreamRes) => {
            if (!res.headersSent) {
              res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
            }
            upstreamRes.pipe(res);
          }
        );

        upstreamReq.on('error', () => {
          sendOfflineFallback(reqUrl, method, res);
        });

        req.on('close', () => {
          if (!upstreamReq.destroyed) {
            upstreamReq.destroy();
          }
        });

        if (method === 'GET' || method === 'HEAD') {
          upstreamReq.end();
        } else {
          req.pipe(upstreamReq);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    resilientApiProxy()
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    conditions: ['production', 'browser', 'module', 'import', 'default']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    allowedHosts: true,
    watch: {
      awaitWriteFinish: {
        stabilityThreshold: 80,
        pollInterval: 20
      }
    }
  }
});
