import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import fs from 'fs';

function centralStoragePlugin(): Plugin {
  const dbFile = path.resolve(__dirname, 'data/server_db.json');

  const readDb = (): Record<string, any> => {
    try {
      if (fs.existsSync(dbFile)) {
        return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
      }
    } catch (err) {
      console.warn('[centralStoragePlugin] Read error:', err);
    }
    return {};
  };

  const writeDb = (data: Record<string, any>): void => {
    try {
      const dir = path.dirname(dbFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('[centralStoragePlugin] Write error:', err);
    }
  };

  const parseBody = (req: any): Promise<any> => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body || '{}'));
        } catch {
          resolve({});
        }
      });
    });
  };

  const handleMiddleware = async (req: any, res: any, next: any) => {
    if (!req.url || !req.url.startsWith('/api/storage')) {
      return next();
    }

    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean); // ['api', 'storage', ...key]

    res.setHeader('Content-Type', 'application/json');

    try {
      if (req.method === 'GET') {
        const db = readDb();
        if (parts.length === 2) {
          // GET /api/storage
          res.end(JSON.stringify(db));
          return;
        } else if (parts.length >= 3) {
          // GET /api/storage/:key
          const key = decodeURIComponent(parts.slice(2).join('/'));
          res.end(JSON.stringify({ key, value: db[key] ?? null }));
          return;
        }
      } else if (req.method === 'POST') {
        const body = await parseBody(req);
        const db = readDb();

        if (parts.length === 2) {
          // POST /api/storage
          if (body.updates && typeof body.updates === 'object') {
            Object.assign(db, body.updates);
          } else if (body.key) {
            db[body.key] = body.value;
          }
          writeDb(db);
          res.end(JSON.stringify({ success: true }));
          return;
        } else if (parts.length >= 3) {
          // POST /api/storage/:key
          const key = decodeURIComponent(parts.slice(2).join('/'));
          db[key] = body.value;
          writeDb(db);
          res.end(JSON.stringify({ success: true, key }));
          return;
        }
      } else if (req.method === 'DELETE' && parts.length >= 3) {
        const key = decodeURIComponent(parts.slice(2).join('/'));
        const db = readDb();
        delete db[key];
        writeDb(db);
        res.end(JSON.stringify({ success: true, key }));
        return;
      }
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e?.message || 'Server error' }));
      return;
    }

    next();
  };

  return {
    name: 'central-storage-plugin',
    configureServer(server) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    centralStoragePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },
      manifest: {
        name: 'pariBet - Private MCA Gaming Club',
        short_name: 'pariBet',
        description: 'Private classroom prediction and virtual betting platform for MCA students',
        theme_color: '#0B0B0F',
        background_color: '#0B0B0F',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});

