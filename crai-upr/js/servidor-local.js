#!/usr/bin/env node
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 8080;
const ROOT = path.resolve(__dirname, '..');

const PROXY_ROUTES = {
  '/api/noticias': { target: 'https://noticias.upr.edu.cu/feed/' },
  '/api/rc-search': {
    target: 'https://rc.upr.edu.cu/rest/items',
    headers: {
      'Accept': 'text/xml, application/xml, application/xhtml+xml;q=0.9, */*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://rc.upr.edu.cu',
      'Referer': 'https://rc.upr.edu.cu/',
    },
  },
  '/api/rc-simple': {
    target: 'https://rc.upr.edu.cu/rest/items/simple-search',
    headers: {
      'Accept': 'text/xml, application/xml, application/xhtml+xml;q=0.9, */*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://rc.upr.edu.cu',
      'Referer': 'https://rc.upr.edu.cu/',
    },
  },
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

function serveStatic(req, res) {
  let filePath = path.join(ROOT, req.url === '/' ? '/index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 - No encontrado');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function proxyAPI(routeConfig, req, res) {
  const targetUrl = routeConfig.target;
  const customHeaders = routeConfig.headers || {};
  const urlObj = new URL(targetUrl);

  if (req.url.includes('?')) {
    const query = req.url.slice(req.url.indexOf('?'));
    urlObj.search = query;
  }

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || 443,
    path: urlObj.pathname + urlObj.search,
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/xml, application/rss+xml, application/xml, text/plain',
      'User-Agent': 'CRAI-UPR-Dev/1.0',
      ...customHeaders,
    },
    rejectUnauthorized: false,
  };

  const proxyReq = https.request(options, (proxyRes) => {
    const chunks = [];
    proxyRes.on('data', c => chunks.push(c));
    proxyRes.on('end', () => {
      const body = Buffer.concat(chunks);
      res.writeHead(proxyRes.statusCode, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream',
      });
      res.end(body);
    });
  });

  proxyReq.on('error', (err) => {
    res.writeHead(502, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ error: 'Error de conexión con el API', detail: err.message }));
  });

  proxyReq.setTimeout(10000, () => {
    proxyReq.destroy();
    res.writeHead(504, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({ error: 'Tiempo de espera agotado' }));
  });

  proxyReq.end();
}

const server = http.createServer((req, res) => {
  let matched = false;
  for (const [route, config] of Object.entries(PROXY_ROUTES)) {
    if (req.url.startsWith(route)) {
      console.log(`  ↳ Proxy: ${config.target}${req.url.slice(route.length)}`);
      proxyAPI(config, req, res);
      matched = true;
      break;
    }
  }
  if (!matched) {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  CRAI-UPR · Servidor de desarrollo');
  console.log('  ─────────────────────────────────');
  console.log(`  Local:    http://localhost:${PORT}/`);
  for (const [route, config] of Object.entries(PROXY_ROUTES)) {
    console.log(`  Proxy:    ${route}  →  ${config.target}`);
  }
  console.log('');
  console.log('  Presiona Ctrl+C para detener.');
  console.log('');
});
