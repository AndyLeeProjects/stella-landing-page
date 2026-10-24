/* Shopify Storefront API client. SERVER-SIDE ONLY.
   Lives under api/_lib (underscore = not exposed as a route by Vercel) and is only
   required by the functions in api/. It reads the PRIVATE token from process.env,
   so it must never be shipped to the browser: the static site (js/*.js) only ever
   calls our own /api/* endpoints and never sees a Shopify token. */
'use strict';

/* Pinned stable version. 2026-10 = latest stable (released 2026-10-01, supported
   until 2027-10-16) per https://shopify.dev/docs/api/usage/versioning. Bump deliberately. */
const API_VERSION = '2026-10';

class ShopifyError extends Error {
  constructor(code, message, status = 502, details) {
    super(message); this.code = code; this.status = status; this.details = details;
  }
}

function config() {
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const token = (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || '').trim();
  if (!domain || !token) throw new ShopifyError('not_configured', 'The shop is not configured yet.', 503);
  return { domain, token };
}

async function shopify(query, variables = {}, { buyerIp } = {}) {
  const { domain, token } = config();
  const headers = { 'Content-Type': 'application/json', 'Shopify-Storefront-Private-Token': token };
  /* Shopify asks server-side private-token callers to forward the buyer IP so its bot
     protection / rate limiting applies per shopper rather than to our server. */
  if (buyerIp) headers['Shopify-Storefront-Buyer-IP'] = buyerIp;
  let res;
  try {
    res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
      method: 'POST', headers, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(15000)
    });
  } catch (e) {
    throw new ShopifyError('network', 'Could not reach the shop. Please try again.', 502);
  }
  let body = null;
  try { body = await res.json(); } catch (e) { /* non-JSON error page */ }
  if (!res.ok) {
    /* Never echo Shopify's raw response to the client: just log the status server-side. */
    console.error('[shopify] HTTP', res.status);
    throw new ShopifyError(res.status === 401 || res.status === 403 ? 'auth' : 'upstream',
      'The shop is temporarily unavailable.', 502);
  }
  if (body && body.errors && body.errors.length) {
    console.error('[shopify] GraphQL errors', JSON.stringify(body.errors).slice(0, 500));
    throw new ShopifyError('graphql', 'The shop is temporarily unavailable.', 502);
  }
  return body.data;
}

/* ---------- Fragments ---------- */
const IMAGE = 'url altText width height';
const MONEY = 'amount currencyCode';

const PRODUCT_CARD = `
  id handle title availableForSale
  featuredImage { ${IMAGE} }
  priceRange { minVariantPrice { ${MONEY} } maxVariantPrice { ${MONEY} } }`;

const PRODUCT_FULL = `
  ${PRODUCT_CARD}
  description descriptionHtml
  options { name optionValues { name } }
  images(first: 20) { nodes { ${IMAGE} } }
  variants(first: 100) { nodes {
    id title availableForSale
    selectedOptions { name value }
    price { ${MONEY} } compareAtPrice { ${MONEY} }
    image { ${IMAGE} }
  } }`;

const CART = `
  id checkoutUrl totalQuantity
  cost { subtotalAmount { ${MONEY} } totalAmount { ${MONEY} } }
  lines(first: 100) { nodes {
    id quantity
    cost { totalAmount { ${MONEY} } }
    merchandise { ... on ProductVariant {
      id title availableForSale
      price { ${MONEY} }
      image { ${IMAGE} }
      product { handle title featuredImage { ${IMAGE} } }
    } }
  } }`;

/* ---------- Products ---------- */
async function listProducts({ collection, first = 50 } = {}, ctx) {
  if (collection) {
    const d = await shopify(`query($h:String!,$n:Int!){ collection(handle:$h){ products(first:$n){ nodes { ${PRODUCT_CARD} } } } }`,
      { h: collection, n: first }, ctx);
    if (!d.collection) throw new ShopifyError('not_found', 'Collection not found.', 404);
    return d.collection.products.nodes;
  }
  const d = await shopify(`query($n:Int!){ products(first:$n, sortKey:CREATED_AT){ nodes { ${PRODUCT_CARD} } } }`, { n: first }, ctx);
  return d.products.nodes;
}

async function getProduct(handle, ctx) {
  const d = await shopify(`query($h:String!){ product(handle:$h){ ${PRODUCT_FULL} } }`, { h: handle }, ctx);
  return d.product; /* null when missing or not published to the Headless channel */
}

/* ---------- Cart ---------- */
function userErrors(payload) {
  const errs = (payload && payload.userErrors) || [];
  if (errs.length) throw new ShopifyError('user_error', errs.map(e => e.message).join(' '), 400, errs);
  return payload.cart;
}

async function getCart(id, ctx) {
  const d = await shopify(`query($id:ID!){ cart(id:$id){ ${CART} } }`, { id }, ctx);
  return d.cart; /* null when expired / completed */
}
async function createCart(lines = [], ctx) {
  const d = await shopify(`mutation($input:CartInput!){ cartCreate(input:$input){ cart { ${CART} } userErrors { field message code } } }`,
    { input: { lines } }, ctx);
  return userErrors(d.cartCreate);
}
async function addLines(cartId, lines, ctx) {
  const d = await shopify(`mutation($c:ID!,$l:[CartLineInput!]!){ cartLinesAdd(cartId:$c, lines:$l){ cart { ${CART} } userErrors { field message code } } }`,
    { c: cartId, l: lines }, ctx);
  return userErrors(d.cartLinesAdd);
}
async function updateLines(cartId, lines, ctx) {
  const d = await shopify(`mutation($c:ID!,$l:[CartLineUpdateInput!]!){ cartLinesUpdate(cartId:$c, lines:$l){ cart { ${CART} } userErrors { field message code } } }`,
    { c: cartId, l: lines }, ctx);
  return userErrors(d.cartLinesUpdate);
}
async function removeLines(cartId, lineIds, ctx) {
  const d = await shopify(`mutation($c:ID!,$l:[ID!]!){ cartLinesRemove(cartId:$c, lineIds:$l){ cart { ${CART} } userErrors { field message code } } }`,
    { c: cartId, l: lineIds }, ctx);
  return userErrors(d.cartLinesRemove);
}

module.exports = { API_VERSION, ShopifyError, shopify, listProducts, getProduct, getCart, createCart, addLines, updateLines, removeLines };
