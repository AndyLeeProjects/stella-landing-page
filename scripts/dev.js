#!/usr/bin/env node
/* Local dev server that mirrors Vercel: static files + SPA fallback, and /api/<name>
   routed to api/<name>.js with .env.local loaded into process.env.
   Usage: node scripts/dev.js [port]   (serve.py still works for static-only previews) */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const PORT = +process.argv[2] || 8080;

const envFile = path.join(ROOT, '.env.local');
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (!m || process.env[m[1]]) continue;
  process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
}

const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.json':'application/json' };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const api = url.pathname.match(/^\/api\/([a-z0-9-]+)\/?$/);
  if (api) {
    const file = path.join(ROOT, 'api', api[1] + '.js');
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('{"error":"not_found"}'); }
    req.query = Object.fromEntries(url.searchParams);
    try { return await require(file)(req, res); } catch (e) { console.error(e); res.statusCode = 500; return res.end('{"error":"server"}'); }
  }
  let p = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(ROOT, 'index.html');
  res.setHeader('Content-Type', TYPES[path.extname(p)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(p).pipe(res);
}).listen(PORT, () => console.log(`dev server on http://localhost:${PORT}`));
