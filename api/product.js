/* GET /api/product?handle=<handle>  -> { product } or 404 { error:'not_found' } */
'use strict';
const { getProduct } = require('./_lib/shopify');
const { send, fail, query, buyerIp } = require('./_lib/http');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'method', message: 'Method not allowed.' });
  const { handle } = query(req);
  if (!handle || !/^[a-z0-9-]{1,255}$/i.test(handle)) return send(res, 400, { error: 'bad_request', message: 'Missing product handle.' });
  try {
    const product = await getProduct(handle, { buyerIp: buyerIp(req) });
    if (!product) return send(res, 404, { error: 'not_found', message: 'This product is not available yet.' });
    send(res, 200, { product });
  } catch (e) { fail(res, e); }
};
