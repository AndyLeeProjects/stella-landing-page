/* GET /api/products[?collection=<handle>]  -> { products: [...] }
   Product listing for the Shop page. Without ?collection, lists every product
   published to the Headless channel. */
'use strict';
const { listProducts } = require('./_lib/shopify');
const { send, fail, query, buyerIp } = require('./_lib/http');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'method', message: 'Method not allowed.' });
  try {
    const { collection } = query(req);
    const products = await listProducts({ collection: collection || undefined }, { buyerIp: buyerIp(req) });
    send(res, 200, { products });
  } catch (e) { fail(res, e); }
};
