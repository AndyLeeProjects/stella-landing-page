/* ============================================================
   WRM — router, menu, cart, pages
   ============================================================ */
(() => {
'use strict';

/* ---------- Data ---------- */
const PRODUCTS = {
  'salmon-purse': {
    id:'salmon-purse', name:'Salmon Purse', variant:'Crust', price:700, year:2026,
    category:'Fish Leather', season:'Ocean Season',
    images:['/img/purse-light.jpg','/img/purse-dark.jpg'],
    desc:'An evening purse that fits your essentials. Classy with a slight flirt. Made with ocean-caught fish leather that is up to 9 times stronger than a cow hide. Leather has a feel of a soft suede.',
    note:'Textures and colors of the bags vary piece to piece. Each skin is unique and no two pieces are identical.',
    origin:'Made in San Francisco',
    dims:[['Height','x"'],['Width','x"'],['Depth','x"'],['Strap length','x"'],['Strap drop','x"'],['Opening width','x"']],
    materials:[['Exterior','Ocean-caught Alaskan Sockeye Salmon'],['Interior','Korean Hemp fabric']],
    care:'Treat like any other leather products. Avoid direct sunlight.'
  },
  'salmon-bookmark': {
    id:'salmon-bookmark', name:'Salmon Bookmark', variant:'Crust', price:32, year:2026,
    category:'Fish Leather', season:'Ocean Season',
    images:['/img/bookmark-blue.jpg','/img/bookmark-detail.jpg'],
    desc:'A small piece of fish leather for your everyday reading. Made with leftover pieces from making the purses. The lining is horse hair, classically used for suiting.',
    note:'Textures and colors vary piece to piece. Each one is unique.',
    origin:'Made in San Francisco',
    dims:[['Height','6.7"'],['Width','2"']],
    materials:[['Leather','Ocean-caught Alaskan Sockeye Salmon'],['Lining','Horsehair']],
    care:'Treat like any other leather products. Avoid direct sunlight.'
  },
  'algae-tote': {
    id:'algae-tote', name:'Algae Tote', variant:'Natural', price:null, soon:true,
    category:'Algae', season:'Ocean Season', images:['/img/algae-tote.jpg'],
    desc:'A translucent tote made from seaweed-based algae film. Still finding its shape.'
  }
};

/* Menu tree — mirrors the requested hierarchy exactly */
const MENU = [
  { label:'Shop', to:'/shop', children:[
    { label:'Ocean Season', to:'/shop/ocean-season', children:[
      { label:'Fish Leather', to:'/shop/ocean-season/fish-leather', children:[
        { label:'Salmon Purse', to:'/product/salmon-purse' },
        { label:'Salmon Bookmark', to:'/product/salmon-bookmark' }
      ]},
      { label:'Algae', soon:true }
    ]}
  ]},
  { label:'About Materials', to:'/about-materials' },
  { label:'WRM World', to:'/wrm-world' },
  { label:'FAQ', to:'/faq' }
];

const FAQ = [
  ['What is fish leather?','Fish leather is made from the skins of fish — ours is Alaskan Sockeye salmon rescued from the food industry. It is tanned with plant-based methods instead of chromium and is up to nine times stronger than cow hide, with a feel close to soft suede.'],
  ['Why does each piece look different?','Because the material is a skin, not a print. The scale pattern, colour and grain change from fish to fish. No two pieces are identical, and we don\'t try to make them so.'],
  ['What is algae film?','A compostable, seaweed-based material made by Sway in San Francisco. Kelp grows up to two feet a day without fresh water, land or fertiliser. We are using it first for packaging, and exploring it for the Algae Tote.'],
  ['How do I care for fish leather?','Treat it like any other leather. Keep it away from direct sunlight and heat, and let it dry naturally if it gets wet. It will develop a patina over time.'],
  ['Where are things made?','Everything is made in small batches, by hand, in San Francisco.'],
  ['Shipping and returns','Pieces ship within 3–5 business days. Unused items may be returned within 14 days of delivery. Write to hello@withrawmaterials.com.']
];

const NEWSLETTER = 'https://script.google.com/macros/s/AKfycbxktzrSNaAXo-I6Hqab5Im9P1R_oXAiIH9d4dtLao1d7F4XntBG1BKKa_5cwD5_leshcg/exec';

/* ---------- Helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + n.toLocaleString('en-US');
const app = $('#app'), nav = $('#nav'), foot = $('#foot');

function toast(msg){
  const t = $('.toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 2400);
}

/* ---------- Cart ---------- */
let cart = JSON.parse(localStorage.getItem('wrm-cart') || '[]');
const save = () => localStorage.setItem('wrm-cart', JSON.stringify(cart));
const count = () => cart.reduce((n,i)=>n+i.qty,0);
const total = () => cart.reduce((n,i)=>n+(PRODUCTS[i.id]?.price||0)*i.qty,0);

function add(id){
  const p = PRODUCTS[id]; if(!p || p.soon) return;
  const it = cart.find(i=>i.id===id); it ? it.qty++ : cart.push({id, qty:1});
  save(); renderCart(); toast(`${p.name} added to cart`);
}
function setQty(id, d){
  const it = cart.find(i=>i.id===id); if(!it) return;
  it.qty += d; if(it.qty<=0) cart = cart.filter(i=>i.id!==id);
  save(); renderCart();
}
function remove(id){ cart = cart.filter(i=>i.id!==id); save(); renderCart(); }

function renderCart(){
  const n = count();
  const btn = $('#cartBtn'), cnt = $('#cartCount');
  btn.hidden = false;
  cnt.hidden = n===0; cnt.textContent = n;
  btn.setAttribute('aria-label', n ? `Open cart, ${n} item${n>1?'s':''}` : 'Open cart');
  const body = $('#cartBody'), ft = $('#cartFoot');
  if(!n){ body.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`; ft.hidden = true; return; }
  body.innerHTML = cart.map(i=>{ const p=PRODUCTS[i.id]; return `
    <div class="cart-item">
      <img src="${p.images[0]}" alt="">
      <div>
        <div class="cart-item-name">${esc(p.name)}</div>
        <div class="cart-item-sub">${esc(p.variant)}</div>
        <div class="cart-item-price">${money(p.price)}</div>
        <button class="cart-remove" data-remove="${p.id}">Remove</button>
      </div>
      <div class="qty">
        <button data-qty="${p.id}" data-d="-1" aria-label="Decrease">−</button>
        <span>${i.qty}</span>
        <button data-qty="${p.id}" data-d="1" aria-label="Increase">+</button>
      </div>
    </div>`; }).join('');
  ft.hidden = false; $('#cartTotal').textContent = money(total());
}

/* ---------- Overlays ---------- */
const menu = $('#menu'), cartEl = $('#cart'), scrim = $('#scrim'), menuBtn = $('#menuBtn');
function openMenu(){ closeCart(); menu.setAttribute('aria-hidden','false'); menuBtn.setAttribute('aria-expanded','true'); nav.classList.add('menu-open'); document.body.style.overflow='hidden'; }
function closeMenu(){ menu.setAttribute('aria-hidden','true'); menuBtn.setAttribute('aria-expanded','false'); nav.classList.remove('menu-open'); document.body.style.overflow=''; }
function openCart(){ closeMenu(); cartEl.setAttribute('aria-hidden','false'); $('#cartBtn').setAttribute('aria-expanded','true'); scrim.hidden=false; requestAnimationFrame(()=>scrim.classList.add('show')); document.body.style.overflow='hidden'; }
function closeCart(){ cartEl.setAttribute('aria-hidden','true'); $('#cartBtn').setAttribute('aria-expanded','false'); scrim.classList.remove('show'); setTimeout(()=>scrim.hidden=true,300); document.body.style.overflow=''; }

function buildMenu(){
  const item = (n) => {
    if(n.soon) return `<span class="menu-item soon">${esc(n.label)}<span class="tag">coming soon</span></span>`;
    if(n.children){
      return `<div class="menu-group">
        <button class="menu-item" aria-expanded="false" data-toggle>${esc(n.label)}<span class="chev">›</span></button>
        <div class="menu-sub">
          <a class="menu-item" href="${n.to}" data-link>All ${esc(n.label)}<span class="chev">→</span></a>
          ${n.children.map(item).join('')}
        </div></div>`;
    }
    return `<a class="menu-item" href="${n.to}" data-link>${esc(n.label)}<span class="chev">→</span></a>`;
  };
  $('#menuList').innerHTML = MENU.map(item).join('') + `
    <div class="menu-foot">
      <a href="https://www.instagram.com/withrawmaterials_" target="_blank" rel="noopener">@withrawmaterials</a>
      <a href="mailto:hello@withrawmaterials.com">hello@withrawmaterials.com</a>
    </div>`;
}

/* ---------- Newsletter ---------- */
async function subscribe(form, source){
  const input = form.querySelector('input[type=email]'), btn = form.querySelector('button'), label = btn.querySelector('[data-label]');
  const email = input.value.trim(); if(!email) return;
  btn.disabled = true; if(label) label.textContent = 'Sending…';
  try{
    await fetch(NEWSLETTER,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({email,source})});
    if(label) label.textContent = 'On the list'; input.value=''; input.placeholder='Thank you — we will write when the tide comes in.';
    toast('You\'re on the list.');
  }catch(e){ if(label) label.textContent='Try again'; }
  finally{ setTimeout(()=>{ btn.disabled=false; },1200); }
}

/* ---------- Pages ---------- */
const crumbs = (list) => `<nav class="crumbs" aria-label="Breadcrumb">${list.map((c,i)=> i===list.length-1
  ? `<span class="cur">${esc(c[0])}</span>` : `<a href="${c[1]}" data-link>${esc(c[0])}</a><span>›</span>`).join('')}</nav>`;

const materialCard = (cls, k1, v1, sup, loc, img, desc) => `
  <div class="material-card ${cls} observe"><div class="mat-col">
    <div class="illus-bg"><img src="${img}" alt=""></div>
    <div class="mat-table">
      <div class="line"><span class="k">${k1}</span><span class="v">${v1}</span></div>
      <div class="line"><span class="k">Supplier</span><span class="v">${sup}<span class="sub">${loc}</span></span></div>
    </div>
    <p class="mat-desc">${desc}</p>
  </div></div>`;

const plate = (p, img, blurb) => `
  <article class="plate observe">
    <a class="plate-img" href="${p.soon?'#':'/product/'+p.id}" ${p.soon?'':'data-link'}><img src="${img}" alt="${esc(p.name)}" loading="lazy"></a>
    <div class="plate-txt">
      <h3 class="plate-name">${esc(p.name)}</h3>
      <p class="plate-sub"><em>The</em> Ocean Collection · ${esc(p.variant)}</p>
      <p class="plate-desc">${blurb}</p>
      <div class="plate-meta">${p.soon ? 'Coming soon' : money(p.price) + ' · ' + esc(p.origin)}</div>
      ${p.soon ? `<button class="btn" data-notify>Notify me <span class="arr">→</span></button>`
               : `<a class="btn" href="/product/${p.id}" data-link>View piece <span class="arr">→</span></a>`}
    </div>
  </article>`;

const pages = {
  home(){
    return window.matchMedia('(max-width:760px)').matches ? pages.homeMobile() : pages.homeDesktop();
  },

  /* Mobile home — the editorial book from mobile_HOME.png */
  homeMobile(){
    document.title = 'WRM — With Raw Materials';
    return `
<section class="mh">
  <a class="mh-plate mh-hero" href="/wrm-world" data-link aria-label="WRM is an attempt to make beautiful things in a world that is burning up. Explore WRM World">
    <img src="/img/m-hero.jpg" alt="" fetchpriority="high">
  </a>
  <a class="mh-plate" href="/shop/ocean-season" data-link aria-label="Chapter I — Ocean">
    <img src="/img/m-ocean.jpg" alt="Chapter I — Ocean" loading="lazy">
  </a>
  <a class="mh-plate" href="/about-materials" data-link aria-label="About the materials">
    <img src="/img/m-materials.jpg" alt="Fish leather and algae" loading="lazy">
  </a>
  <div class="mh-concept observe">
    <p>The products at WRM come as a proof of concept, bringing these materials to everyday life.</p>
  </div>
  <a class="mh-plate" href="/product/salmon-purse" data-link aria-label="Salmon Purse, Crust"><img src="/img/m-purse.jpg" alt="Salmon Purse — Crust" loading="lazy"></a>
  <a class="mh-plate" href="/product/salmon-bookmark" data-link aria-label="Salmon Bookmark, Crust"><img src="/img/m-bookmark.jpg" alt="Salmon Bookmark — Crust" loading="lazy"></a>
  <div class="mh-plate" aria-label="Algae Tote, Natural, coming soon"><img src="/img/m-tote.jpg" alt="Algae Tote — Natural — Coming soon" loading="lazy"></div>
</section>`;
  },

  homeDesktop(){
    document.title = 'WRM — Ocean season coming soon';
    return `
<section class="hero" id="top">
  <div class="hero-card">
    <div class="logo-wrap reveal"><img src="/img/wrm-logo-dark.png" alt="WRM — With Raw Materials"></div>
    <h1 class="headline reveal d2">Ocean season <span class="italic">coming</span> <span class="soft">soon.</span></h1>
    <form class="notify reveal d3" data-newsletter="landing">
      <input type="email" required placeholder="Your email" autocomplete="email" aria-label="Email">
      <button type="submit"><span data-label>Notify me</span> <span class="arr">→</span></button>
    </form>
  </div>
  <a class="scroll-hint reveal d4" href="#chapter">Chapter I</a>
</section>

<section class="editorial" id="chapter"><div class="ed-page">
  <div class="ocean-chapter observe"><div class="illus"><img src="/img/illustration-ocean.png" alt=""></div></div>
  <hr class="rule">
  <div class="row observe" style="padding-bottom:200px">
    <div class="label">Philosophy</div>
    <div class="body-copy">
      <span class="smallcaps">WRM came from</span><br>
      a place of love of materials that things are made of,<br>
      an uncontrollable desire of beautiful things,<br>
      an understanding of their impact on the planet,<br>
      an unlearning of the system in order to rebuild it,<br>
      and confidence in what we hope for.
    </div>
  </div>
</div></section>

<section class="editorial"><div class="ed-page">
  <hr class="rule">
  <div class="materials-header observe">Ocean Collection<br>Material Descriptions</div>
  ${materialCard('salmon','Hero Material','Salmon Leather','7 Leagues','Vancouver, Canada','/img/illustration-salmon.png',
    'Made from rescued fish skins and plant-based tanning, this leather avoids the toxic chromium used in most of the industry. With ongoing work in natural dyes and PFAS-free finishes, it offers a cleaner, waste-conscious approach aligned with shifting regulations and material expectations.')}
  ${materialCard('algae','Packaging','Algae','Sway','San Francisco, California','/img/illustration-seaweed.png',
    'Sway is a California-based innovation company redesigning the future of everyday materials. We\'re replacing polluting plastics with compostable, seaweed-based packaging that helps replenish the planet, from sea to soil. Designed to perform like plastic and scale through legacy systems, Sway materials solve for the many challenges of failed alternatives, offering a viable path to beat plastic for good.')}
</div></section>

<!-- Added on top of the replica: the pieces, paced like plates in a book -->
<section class="editorial home-products"><div class="ed-page">
  <hr class="rule">
  <div class="hdr observe">The Pieces<br>Proof of Concept</div>
  ${plate(PRODUCTS['salmon-purse'],'/img/purse-dark.jpg','An evening purse that fits your essentials. Ocean-caught fish leather, up to nine times stronger than cow hide, with the hand of soft suede.')}
  ${plate(PRODUCTS['salmon-bookmark'],'/img/bookmark-blue.jpg','A small piece of fish leather for everyday reading, cut from what was left after the purses. Lined in horsehair.')}
  <figure class="plate-full observe"><img src="/img/algae-tote.jpg" alt="Algae Tote — Natural — Coming soon" loading="lazy"><figcaption><button class="btn" data-notify>Notify me <span class="arr">→</span></button></figcaption></figure>
</div></section>

<section class="editorial" style="margin-top:60px"><div class="ed-page about-page">
  <div class="about-top">
    <hr class="rule">
    <div class="about-row observe">
      <div class="about-label">About the Brand</div>
      <div class="about-body"><strong>WRM</strong> is a work in progress, with the goal of becoming a new ecosystem of materials for the things we consume. Handbags are a way to enter the world and navigate the current system, not the end.</div>
    </div>
  </div>
  <div class="about-bottom">
    <hr class="rule">
    <div class="foot-row-live observe">
      <a class="foot-link" href="https://www.instagram.com/withrawmaterials_" target="_blank" rel="noopener">@withrawmaterials</a>
      <div class="foot-logo"><img src="/img/wrm-logo-dark.png" alt="WITH RAW MATERIALS"></div>
      <a class="foot-link right" href="mailto:hello@withrawmaterials.com">hello@withrawmaterials.com</a>
    </div>
  </div>
</div></section>`;
  },

  shop(){
    document.title = 'Shop — WRM';
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Home','/'],['Shop']])}
      <h1 class="pg-title">Shop</h1>
      <p class="pg-sub">One season at a time.</p>
      <div class="cats">
        <a class="cat observe" href="/shop/ocean-season" data-link>
          <div class="cat-img"><img src="/img/ocean-scales.jpg" alt=""></div>
          <div class="cat-name">Ocean Season</div>
          <div class="cat-sub">Chapter I · Fish leather &amp; algae</div>
        </a>
      </div>
    </div></section>`;
  },

  season(){
    document.title = 'Ocean Season — WRM';
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Shop','/shop'],['Ocean Season']])}
      <div class="season-hero observe"><img src="/img/ocean-scales.jpg" alt="Chapter I — Ocean"></div>
      <div class="cats">
        <a class="cat observe" href="/shop/ocean-season/fish-leather" data-link>
          <div class="cat-img"><img src="/img/fish-texture.jpg" alt=""></div>
          <div class="cat-name">Fish Leather</div><div class="cat-sub">Salmon Purse · Salmon Bookmark</div>
        </a>
        <a class="cat soon observe" href="#">
          <div class="cat-img"><img src="/img/algae-texture.jpg" alt=""></div>
          <div class="cat-name">Algae</div><div class="cat-sub">Coming soon</div>
        </a>
      </div>
    </div></section>`;
  },

  fishLeather(){
    document.title = 'Fish Leather — WRM';
    const card = p => `<a class="card observe" href="/product/${p.id}" data-link>
      <div class="card-img"><img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="card-txt"><div><div class="card-name">${esc(p.name)}</div><div class="card-var">${esc(p.variant)}</div></div>
      <div class="card-price">${money(p.price)}</div></div></a>`;
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Shop','/shop'],['Ocean Season','/shop/ocean-season'],['Fish Leather']])}
      <h1 class="pg-title">Fish Leather</h1>
      <p class="pg-sub">Ocean-caught Alaskan Sockeye salmon. Crust finish.</p>
      <div class="grid">${card(PRODUCTS['salmon-purse'])}${card(PRODUCTS['salmon-bookmark'])}
        <div class="card observe"><div class="card-img natural"><img src="/img/algae-tote.jpg" alt="Algae Tote — Natural — Coming soon" loading="lazy"></div>
          <div class="card-txt"><div><div class="card-name">Algae Tote</div><div class="card-var">Natural</div></div></div>
          <button class="btn" data-notify>Notify me <span class="arr">→</span></button></div>
      </div>
    </div></section>`;
  },

  product(id){
    const p = PRODUCTS[id]; if(!p || p.soon) return pages.notFound();
    document.title = `${p.name} — WRM`;
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Ocean','/shop/ocean-season'],['Fish Leather','/shop/ocean-season/fish-leather'],[p.name]])}
      <div class="pd">
        <div class="pd-gallery">
          <div class="pd-main"><img id="pdImg" src="${p.images[0]}" alt="${esc(p.name)}"><span class="n" id="pdN">1 / ${p.images.length}</span></div>
          <div class="pd-thumbs">${p.images.map((s,i)=>`<button data-thumb="${i}" aria-current="${i===0}"><img src="${s}" alt=""></button>`).join('')}</div>
        </div>
        <div class="pd-info">
          <h1 class="pd-name">${esc(p.name)}</h1>
          <div class="pd-meta"><span>${esc(p.variant)}, ${p.year}</span><span class="pd-price">${money(p.price)}</span></div>
          <p class="pd-desc">${esc(p.desc)}</p>
          <p class="pd-desc small">${esc(p.note)}</p>
          <div class="pd-origin">${esc(p.origin)}</div>
          <div class="pd-actions"><button class="btn btn-fill" style="width:auto" data-add="${p.id}">Add to cart <span class="arr">→</span></button></div>
          <div class="specs">
            <h3>Dimensions</h3>
            ${p.dims.map(([k,v])=>`<div class="line"><span class="k">${k}</span><span>${v}</span></div>`).join('')}
            <h3>Materials</h3>
            ${p.materials.map(([k,v])=>`<div class="line"><span class="k">${k}</span><span>${v}</span></div>`).join('')}
            <h3>Care</h3><p>${esc(p.care)}</p>
          </div>
        </div>
      </div>
    </div></section>`;
  },

  materials(){
    document.title = 'About the Materials — WRM';
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Home','/'],['About The Materials']])}
      <a class="mat-hero observe" href="/about-materials/fish-leather" data-link aria-label="Fish Leather"><img src="/img/fish-leather-hero.jpg" alt="Fish Leather"></a>
      <a class="mat-hero observe" href="/about-materials/algae" data-link aria-label="Algae"><img src="/img/algae-hero.jpg" alt="Algae"></a>
    </div></section>`;
  },

  materialDetail(which){
    const fish = which==='fish-leather';
    document.title = (fish?'Fish Leather':'Algae') + ' — WRM';
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['About The Materials','/about-materials'],[fish?'Fish Leather':'Algae']])}
      <div class="mat-detail ${fish?'fish':'algae'}">
        <div class="mat-head observe">
          <img class="sil" src="${fish?'/img/sil-fish.png':'/img/sil-seaweed.png'}" alt="">
          <h2>${fish?'From industry waste to bags':'Algae as a future replacement to plastic'}</h2>
        </div>
        ${fish?`<figure class="mat-fig observe"><img src="/img/fish-fig.jpg" alt="Fish leather, close"><figcaption>Fig. 01</figcaption></figure>`:''}
        <div class="mat-body observe">
          <p class="sub">${fish?'Fish Leather':'Algae'}</p>
          ${fish
            ? `<p>Sockeye salmon sourced from industry waste. A supple yet durable material highlighting its natural grain and colors.</p>`
            : `<p>Kelp can grow as much as two feet in a single day, making it one of the fastest-growing plants on earth. It's cultivated without the water, land, or fertilizer inputs most raw materials require.</p>`}
        </div>
        <div class="mat-cta observe"><a class="link" href="/shop/ocean-season${fish?'/fish-leather':''}" data-link>Shop Collection</a></div>
      </div>
    </div></section>`;
  },

  world(){
    document.title = 'WRM World';
    return `<section class="pg editorial" style="padding-top:var(--nav-h)!important"><div class="ed-page">
      <div class="world-hero observe"><img src="/img/moodboard.jpg" alt="WRM is an attempt to make beautiful things in a world that is burning up."></div>
      <div class="prose observe">
        <p>It began with a love of the materials that things are made of, and an uncontrollable desire for beautiful things. Then an understanding of their cost to the planet. Then the slower work of unlearning the system in order to rebuild it.</p>
        <p>Handbags are how we enter the world and move through the current system. They are not the end. The end is a new ecosystem of materials for the things we consume — grown, rescued, returned.</p>
        <p>Everything here is a proof of concept, made by hand in San Francisco, a few pieces at a time.</p>
        <p><a class="link" href="/about-materials" data-link>Read about the materials</a></p>
      </div>
    </div></section>`;
  },

  faq(){
    document.title = 'FAQ — WRM';
    return `<section class="pg editorial"><div class="ed-page">
      ${crumbs([['Home','/'],['FAQ']])}
      <h1 class="pg-title">Questions</h1>
      <p class="pg-sub">If yours isn't here, write to <a class="link" href="mailto:hello@withrawmaterials.com">hello@withrawmaterials.com</a>.</p>
      <div class="faq">${FAQ.map(([q,a],i)=>`<div class="faq-item${i===0?' open':''}">
        <button class="faq-q" aria-expanded="${i===0}">${esc(q)}<span class="chev">›</span></button>
        <div class="faq-a">${esc(a)}</div></div>`).join('')}</div>
    </div></section>`;
  },

  notFound(){
    document.title = 'Not found — WRM';
    return `<section class="pg editorial"><div class="ed-page"><h1 class="pg-title">Not here.</h1><p class="pg-sub"><a class="link" href="/" data-link>Back to the beginning</a></p></div></section>`;
  }
};

/* ---------- Router ---------- */
const routes = [
  [/^\/$/, ()=>pages.home()],
  [/^\/shop\/?$/, ()=>pages.shop()],
  [/^\/shop\/ocean-season\/?$/, ()=>pages.season()],
  [/^\/shop\/ocean-season\/fish-leather\/?$/, ()=>pages.fishLeather()],
  [/^\/product\/([\w-]+)\/?$/, m=>pages.product(m[1])],
  [/^\/about-materials\/?$/, ()=>pages.materials()],
  [/^\/about-materials\/(fish-leather|algae)\/?$/, m=>pages.materialDetail(m[1])],
  [/^\/wrm-world\/?$/, ()=>pages.world()],
  [/^\/faq\/?$/, ()=>pages.faq()],
];

let io;
function render(path, y=0){
  closeMenu(); closeCart();
  let html = null;
  for(const [re,fn] of routes){ const m = path.match(re); if(m){ html = fn(m); break; } }
  app.innerHTML = `<div class="page">${html ?? pages.notFound()}</div>`;
  const isHome = path === '/';
  foot.classList.toggle('hide', isHome && !window.matchMedia('(max-width:760px)').matches); /* desktop home keeps the live site's own footer */
  nav.classList.toggle('on-dark', isHome && window.matchMedia('(max-width:760px)').matches);
  renderCart();
  io?.disconnect();
  io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
  app.querySelectorAll('.observe').forEach(el=>io.observe(el));
  window.scrollTo({top:y, behavior:'instant'});
  onScroll();
}
function go(path, push=true){ if(push){ history.replaceState({path:location.pathname, y:scrollY},''); history.pushState({path},'',path);} render(path); }
if('scrollRestoration' in history) history.scrollRestoration='manual';
window.addEventListener('popstate', e => render(e.state?.path || location.pathname, e.state?.y||0));

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]'); if(a){ e.preventDefault(); go(a.getAttribute('href')); return; }
  const tg = e.target.closest('[data-toggle]'); if(tg){ const open = tg.getAttribute('aria-expanded')==='true'; tg.setAttribute('aria-expanded',String(!open)); tg.nextElementSibling.classList.toggle('open',!open); return; }
  const ad = e.target.closest('[data-add]'); if(ad){ add(ad.dataset.add); openCart(); return; }
  const q = e.target.closest('[data-qty]'); if(q){ setQty(q.dataset.qty, +q.dataset.d); return; }
  const rm = e.target.closest('[data-remove]'); if(rm){ remove(rm.dataset.remove); return; }
  const th = e.target.closest('[data-thumb]'); if(th){ const i=+th.dataset.thumb, p=PRODUCTS[location.pathname.split('/')[2]]; $('#pdImg').src=p.images[i]; $('#pdN').textContent=`${i+1} / ${p.images.length}`; document.querySelectorAll('[data-thumb]').forEach(b=>b.setAttribute('aria-current',String(b===th))); return; }
  const fq = e.target.closest('.faq-q'); if(fq){ const it=fq.parentElement, open=it.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open'); x.querySelector('.faq-q').setAttribute('aria-expanded','false');}); if(!open){ it.classList.add('open'); fq.setAttribute('aria-expanded','true'); } return; }
  const nt = e.target.closest('[data-notify]'); if(nt){ toast('Sign up below and we\'ll tell you when it\'s ready.'); foot.querySelector('input')?.focus(); return; }
  if(e.target.closest('#checkout')){ location.href = 'mailto:hello@withrawmaterials.com?subject=' + encodeURIComponent('Order enquiry — WRM') + '&body=' + encodeURIComponent(cart.map(i=>`${i.qty} × ${PRODUCTS[i.id].name} (${PRODUCTS[i.id].variant})`).join('\n') + `\n\nTotal ${money(total())}`); return; }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if(f.matches('[data-newsletter]')){ e.preventDefault(); subscribe(f, f.dataset.newsletter); }
  if(f.id==='footForm'){ e.preventDefault(); subscribe(f,'footer'); f.querySelector('input').value=''; }
});
menuBtn.addEventListener('click', ()=> menu.getAttribute('aria-hidden')==='false' ? closeMenu() : openMenu());
$('#cartBtn').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
scrim.addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if(e.key==='Escape'){ closeMenu(); closeCart(); } });

function onScroll(){ const mobHome = location.pathname==='/' && window.matchMedia('(max-width:760px)').matches; nav.classList.toggle('solid', !mobHome && (window.scrollY > 24 || location.pathname !== '/')); }
window.addEventListener('scroll', onScroll, {passive:true});

window.matchMedia('(max-width:760px)').addEventListener('change', ()=>{ if(location.pathname==='/') render('/', scrollY); });

/* ---------- Init ---------- */
buildMenu();
render(location.pathname);
})();
