/* Small request/response helpers shared by the api/* functions (not a route). */
'use strict';
const { ShopifyError } = require('./shopify');

function send(res, status, data, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(data));
}

function fail(res, err) {
  if (err instanceof ShopifyError) return send(res, err.status, { error: err.code, message: err.message });
  console.error('[api] unexpected', err && err.stack || err);
  return send(res, 500, { error: 'server', message: 'Something went wrong. Please try again.' });
}

function query(req) {
  if (req.query) return req.query; /* Vercel pre-parses */
  return Object.fromEntries(new URL(req.url, 'http://x').searchParams);
}

async function body(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = []; for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function cookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('='); if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function buyerIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (xf ? String(xf).split(',')[0] : req.socket && req.socket.remoteAddress || '').trim() || undefined;
}

module.exports = { send, fail, query, body, cookies, buyerIp };
