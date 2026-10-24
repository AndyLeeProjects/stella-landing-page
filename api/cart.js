/* Cart, backed by the Shopify Cart API. The cart ID lives in an HttpOnly cookie
   (wrm_cart) so page scripts never handle it.

   GET  /api/cart                                         -> { cart | null }
   POST /api/cart {action:'add', merchandiseId, quantity}  -> { cart }   (creates the cart on first add)
   POST /api/cart {action:'update', lineId, quantity}      -> { cart }   (quantity 0 removes the line)
   POST /api/cart {action:'remove', lineId}                -> { cart }
*/
'use strict';
const S = require('./_lib/shopify');
const { send, fail, body, cookies, buyerIp } = require('./_lib/http');

const COOKIE = 'wrm_cart';
const MAX_AGE = 60 * 60 * 24 * 10; /* Shopify carts expire 10 days after last update */
const MAX_QTY = 99;

function cookieHeader(req, value) {
  const host = String(req.headers.host || '');
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  const base = `${COOKIE}=${value ? encodeURIComponent(value) : ''}; Path=/; HttpOnly; SameSite=Lax${local ? '' : '; Secure'}`;
  return value ? `${base}; Max-Age=${MAX_AGE}` : `${base}; Max-Age=0`;
}

const qty = n => { n = Number(n); return Number.isInteger(n) && n >= 0 && n <= MAX_QTY ? n : null; };

module.exports = async (req, res) => {
  const ctx = { buyerIp: buyerIp(req) };
  let cartId = cookies(req)[COOKIE] || null;
  try {
    /* A stale cookie (cart expired or already checked out) is treated as no cart. */
    let cart = cartId ? await S.getCart(cartId, ctx) : null;
    if (cartId && !cart) cartId = null;

    if (req.method === 'GET') {
      return send(res, 200, { cart }, cart ? {} : { 'Set-Cookie': cookieHeader(req, null) });
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'method', message: 'Method not allowed.' });

    let input;
    try { input = await body(req); } catch (e) { return send(res, 400, { error: 'bad_request', message: 'Invalid request.' }); }
    const { action } = input || {};

    if (action === 'add') {
      const quantity = qty(input.quantity ?? 1);
      if (!input.merchandiseId || !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(input.merchandiseId) || !quantity)
        return send(res, 400, { error: 'bad_request', message: 'Invalid product.' });
      const lines = [{ merchandiseId: input.merchandiseId, quantity }];
      cart = cart ? await S.addLines(cart.id, lines, ctx) : await S.createCart(lines, ctx);
    } else if (action === 'update' || action === 'remove') {
      if (!cart) return send(res, 409, { error: 'no_cart', message: 'Your cart has expired. Please add the item again.' }, { 'Set-Cookie': cookieHeader(req, null) });
      const lineId = input.lineId;
      if (!lineId || !cart.lines.nodes.some(l => l.id === lineId)) return send(res, 400, { error: 'bad_request', message: 'That item is no longer in your cart.' });
      const quantity = action === 'remove' ? 0 : qty(input.quantity);
      if (quantity === null) return send(res, 400, { error: 'bad_request', message: 'Invalid quantity.' });
      cart = quantity === 0 ? await S.removeLines(cart.id, [lineId], ctx) : await S.updateLines(cart.id, [{ id: lineId, quantity }], ctx);
    } else {
      return send(res, 400, { error: 'bad_request', message: 'Unknown cart action.' });
    }
    send(res, 200, { cart }, { 'Set-Cookie': cookieHeader(req, cart.id) });
  } catch (e) { fail(res, e); }
};
