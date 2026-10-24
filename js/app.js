/* ============================================================
   WRM — router, menu, cart, pages
   ============================================================ */
(() => {
'use strict';

/* ---------- Data ---------- */
const PRODUCTS = {
  'salmon-purse': {
    id:'salmon-purse', name:'Salmon Purse', variant:'Crust', price:0, year:2026,
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
    id:'salmon-bookmark', name:'Salmon Bookmark', variant:'Crust', price:0, year:2026,
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
    { label:'Ocean', to:'/shop/ocean-season', children:[
      { label:'Fish Leather', to:'/shop/ocean-season/fish-leather' },
      { label:'Algae', to:'/about-materials/algae' }
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

/* Mobile v2 (Drive redesign) copy, verbatim from Purse@2x / Bookmark@2x / Algae_Tote@2x.png. */
const M2_PRODUCT = {
  'salmon-purse': { variant:'Natural Crust', price:'$', images:['/img/m2-pd-purse.jpg','/img/purse-dark.jpg'],
    alt:'Salmon Purse in natural crust salmon leather',
    blocks:[
      ['Your classic evening purse made with ocean-caught salmon leather. Fits your essentials. Pleated sides, lined with Korean hemp, finished with invisible magnet closure.'],
      ['Please note the textures and colors of the bags vary piece to piece. Each skin is unique and no two pieces are identical.'],
      ['Product Detail','Made in San Francisco'],
      ['Dimensions','H: 6” x W: 7” D: 1.5”','Strap Drop: 5.25”'],
      ['Material','Exterior Body: 100% Ocean-Caught Alaskan Sockeye Salmon','Interior: 100% Korean Hemp fabric'],
      ['Care','Treat like any other leather products, and see a specialist for cleaning. Avoid direct sunlight']
    ]},
  'salmon-bookmark': { variant:'Natural Crust', price:'$', images:['/img/m2-pd-bookmark.jpg','/img/bookmark-detail.jpg'],
    alt:'Salmon Bookmark, salmon leather front and horsehair lining',
    blocks:[
      ['A small piece of fish leather for your everyday reading. Made with leftover pieces from making the purses. Lined with horse hair classically used for suiting.'],
      ['Please note the textures and colors of the bags vary piece to piece. Each skin is unique and no two pieces are identical.'],
      ['Product Detail','Made in San Francisco'],
      ['Dimensions','H: 6.7” x W: 2”'],
      ['Material','Leather: Ocean-caught Alaskan Sockeye Salmon','Lining: Horsehair'],
      ['Care','Treat like any other leather products.','Avoid direct sunlight.']
    ]},
  'algae-tote': { variant:'Natural', price:'$', images:['/img/m2-pd-tote.jpg'],
    alt:'Algae Tote, translucent seaweed-based sheet',
    blocks:[
      ['Your classic everyday tote made with algae. The seaweed is dehydrated and processed into a powder form, which then formulated and turned into sheets by Sway (learn more about Sway in our <a href="/about-materials/algae" data-link>materials page</a>).'],
      ['You can expect a waxed canvas-like hand feel. The waxiness will disappear with wear. Please note the textures and colors of the bags vary piece to piece.'],
      ['Product Detail','Manufactured in San Francisco'],
      ['Dimensions','H: 6” x W: 7” D: 1.5”','Strap Drop: 5.25”'],
      ['Material','Exterior Body: 100% compostable algae-based sheet'],
      ['Care','Avoid moisture and direct sunlight','Please see <a href="/faq" data-link>FAQ page</a> for detailed instructions on how to care for this material.']
    ]}
};

/* Edit Notes (9/7): material FAQs, shown as drop-downs on the About Materials stories. */
const M2_MATERIAL_FAQ = {
  fish: [
    ['Material & Performance', [
      ['How strong is it?','Salmon leather is stronger than cowhide of the same weight. Its fibers cross rather than run in a single direction, a structure shaped by the fish’s need to move through water.'],
      ['Is it waterproof?','Not by nature. We recommend keeping it dry and away from prolonged moisture.'],
      ['How does it wear over time?','The leather softens with use, and patinas into a natural darker shade over time. A natural patina rather than wear.'],
      ['Does the texture vary piece to piece?','Yes. Please understand that each skin is unique, and no two pieces are identical!'],
      ['Does the color fade in sunlight?','As with any natural leather, prolonged direct sunlight will expedite the darkening of the tone over time. We recommend storing it out of direct light.']]],
    ['Living With It', [
      ['What does it smell like?','Properly tanned leather carries zero to barely any scent of fish.'],
      ['Will my pet eat it?','It is leather, and should be treated with the same care as any fine leather good around pets.'],
      ['How do I clean it?','Wipe with a soft, dry cloth. Avoid water and household cleaning products. You may use wax to buff the area afterwards.'],
      ['Can it get wet?','If you get caught in the rain, this is not the bag to use as cover. We recommend against getting wet. If it happens, allow it to air dry away from direct heat.'],
      ['How should I store it?','In a cool, dry place, away from direct sunlight — ideally in its dust bag.'],
      ['Does it need conditioning?','No regular conditioning is required.']]],
    ['Origin & Sourcing', [
      ['Where does the salmon skin come from?','The tannery works closely with a sushi restaurant group to collect the skins. The restaurant uses ocean-caught Alaskan salmon; the tannery takes what would otherwise be discarded.'],
      ['Is this a byproduct, or is the fish farmed for the leather?','A byproduct of the restaurant industry. No fish is farmed for the leather.'],
      ['Is the fish also used for food?','Yes. The fillet is served at the restaurant the tannery works with.'],
      ['Is it vegan?','No. This is an animal material.']]],
    ['Circularity & End of Life', [
      ['What happens to it, eventually?','The leather is tanned without chromium, so it can return to soil at the end of its life. Thread selection and full compostability testing for the finished object are ongoing.']]],
    ['Value & Ownership', [
      ['How long will it last?','The material is built for use over years.'],
      ['Is each piece one of one?','Each bag is one of one. no two are identical due to the nature of the skin'],
      ['Can it be repaired if damaged?','Contact us directly to discuss repair.']]]
  ],
  algae: [
    ['Material & Performance', [
      ['How strong is it?','It’s a seaweed-derived sheet material, structurally different from a woven textile or hide. In practice, it holds up well to regular handling, however similarly to plastic film it will stretch with force.'],
      ['Is it waterproof?','It’s moisture-resistant rather than fully waterproof. We’d treat it the way you’d treat any considered object — dry it if it gets wet.'],
      ['How does it wear over time?','This is a newer material category than leather, without the same century of reference. What we’ve seen so far points to a material that holds its shape and resists moisture well under regular use. We’ll continue to share what we learn as pieces move through the world. It’s similar to waxed canvas.'],
      ['What does it smell like?','It does not smell like seaweed. The material is designed and processed to be completely scent-free so it does not transfer any ocean or plant odors to the packaged goods inside.']]],
    ['Origin & Sourcing', [
      ['Where does the algae material come from?','The material begins as seaweed. Under the right conditions, kelp can grow as much as two feet in a single day — making it one of the fastest-growing plants on earth — and it’s cultivated without the water, land, or fertilizer inputs most raw materials require. It’s grown on ocean farms, then processed by a California-based material studio into a flexible sheet form, which we cut and sew into finished objects in San Francisco.']]],
    ['Circularity & End of Life', [
      ['What happens to it, eventually?','The material is designed to compost. We’re still testing how the finished object performs in home versus industrial composting environments. We’ll share results as that testing completes.']]],
    ['Value & Ownership', [
      ['Can it be repaired if damaged?','Contact us directly to discuss repair.']]]
  ]
};

/* Edit Notes (9/7): FAQ keeps shipping only. */
const M2_FAQ = [['Shipping and returns','Pieces ship within 3–5 business days. Unused items may be returned within 14 days of delivery. Write to hello@withrawmaterials.com.']];

/* Desktop v2 (js/desktop.js) reuses the same FAQ data. */
window.WRMData = { M2_FAQ, M2_MATERIAL_FAQ };

const NEWSLETTER ='https://script.google.com/macros/s/AKfycbxktzrSNaAXo-I6Hqab5Im9P1R_oXAiIH9d4dtLao1d7F4XntBG1BKKa_5cwD5_leshcg/exec';

/* ---------- Helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '$' + Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const app = $('#app'), nav = $('#nav'), foot = $('#foot');
const isMobile = () => window.matchMedia('(max-width:760px)').matches;

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
/* <html> is the scrolling element, so locking <body> alone lets the page scroll behind open overlays. */
function lockScroll(on){ const v=on?'hidden':''; document.documentElement.style.overflow=v; document.body.style.overflow=v; }
function openMenu(){ closeCart(); menu.setAttribute('aria-hidden','false'); menuBtn.setAttribute('aria-expanded','true'); nav.classList.add('menu-open'); lockScroll(true); }
function closeMenu(){ menu.setAttribute('aria-hidden','true'); menuBtn.setAttribute('aria-expanded','false'); nav.classList.remove('menu-open'); lockScroll(false); }
function openCart(){ closeMenu(); cartEl.setAttribute('aria-hidden','false'); $('#cartBtn').setAttribute('aria-expanded','true'); scrim.hidden=false; requestAnimationFrame(()=>scrim.classList.add('show')); lockScroll(true); }
function closeCart(){ cartEl.setAttribute('aria-hidden','true'); $('#cartBtn').setAttribute('aria-expanded','false'); scrim.classList.remove('show'); setTimeout(()=>scrim.hidden=true,300); lockScroll(false); }

function buildMenu(){
  $('#mobileMenuClose')?.remove();
  menu.querySelector('.menu-footer')?.remove();
  if(isMobile()){
    /* MENU@2x.png / MENU_1@2x.png rows: all 4 parent categories (Shop, About Materials,
       WRM World, FAQ), with Shop expanding to reveal Ocean/Fish Leather/Algae, per Andy. */
    const row = (label, to, aria) => `<a class="menu-item m2-menu-row" href="${to}" data-link${aria?` aria-label="${aria}"`:''}><span class="m2-menu-label">${label}</span><span class="chev" aria-hidden="true">&gt;</span></a>`;
    $('#menuList').innerHTML =
      `<div class="m2-menu-shop">
        <button class="menu-item m2-menu-row" data-acc aria-expanded="false" aria-controls="m2menu-shop-sub">
          <span class="m2-menu-label">Shop <img class="m2-menu-ocean" src="/img/illustration-ocean.png" alt=""></span>
          <span class="chev" aria-hidden="true">&gt;</span>
        </button>
        <div class="m2-menu-sub" id="m2menu-shop-sub" hidden>
          <a class="menu-item m2-menu-row m2-menu-sub-row" href="/shop/ocean-season/fish-leather" data-link><span class="m2-menu-label">Fish Leather</span><span class="chev" aria-hidden="true">&gt;</span></a>
          <a class="menu-item m2-menu-row m2-menu-sub-row" href="/about-materials/algae" data-link><span class="m2-menu-label">Algae</span><span class="chev" aria-hidden="true">&gt;</span></a>
        </div>
      </div>` +
      row('About Materials','/about-materials') +
      row('WRM World','/wrm-world') +
      row('FAQ','/faq');
    const menuFooter = foot.cloneNode(true);
    menuFooter.removeAttribute('id');
    menuFooter.className = 'foot menu-footer';
    menuFooter.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    menuFooter.querySelector('form').dataset.newsletter = 'menu';
    menuFooter.querySelector('.foot-lead').textContent = 'Stay updated with WRM’s material explorations.';
    menuFooter.querySelector('.foot-links a')?.remove(); /* Menu footer has Contact and FAQ only. */
    menu.append(menuFooter);
    const close = document.createElement('button');
    close.id = 'mobileMenuClose'; close.className = 'mobile-menu-close';
    close.setAttribute('aria-label','Close menu'); close.innerHTML = '<span></span><span></span>';
    close.addEventListener('click',closeMenu); nav.append(close);
    return;
  }
  const item = (n) => {
    if(n.soon) return `<span class="menu-item soon">${esc(n.label)}<span class="tag">coming soon</span></span>`;
    if(n.children){
      return `<div class="menu-group">
        <button class="menu-item" aria-expanded="false" data-toggle>${esc(n.label)}<span class="chev">&gt;</span></button>
        <div class="menu-sub">

          ${n.children.map(item).join('')}
        </div></div>`;
    }
    return `<a class="menu-item" href="${n.to}" data-link>${esc(n.label)}<span class="chev">&gt;</span></a>`;
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
  ? `<span class="cur">${esc(c[0])}</span>` : `<a href="${c[1]}" data-link>${esc(c[0])}</a><span>${isMobile()?'&gt;':'›'}</span>`).join('')}</nav>`;

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
    return isMobile() ? pages.homeMobile() : pages.homeDesktop();
  },

  /* Mobile home — HOME@2x.png (751 × 5762). Real photos and HTML copy, every plate a link. */
  homeMobile(){
    document.title = 'WRM — With Raw Materials';
    const plate = (cls, href, img, alt, cap) => `<a class="m2h-plate ${cls}" href="${href}" data-link><img src="${img}" alt="${alt}" loading="lazy"><span class="m2h-cap">${cap}</span></a>`;
    return `<section class="m2h" aria-label="Chapter I: Ocean">
      <div class="m2h-hero">
        <img class="m2h-hero-img" src="/img/m2-home-hero.jpg" alt="Salmon Purse in natural crust salmon leather" fetchpriority="high">
        <img class="m2h-ocean" src="/img/illustration-ocean.png" alt="">
        <h1 class="m2h-chapter"><span>Chapter I</span><span class="m2-sr">Ocean</span></h1>
        <p class="m2h-lede">With fish leather and algae, WRM begins<br>a new story for the objects we live with.</p>
        <p class="m2h-credit">Photos by Sahra Jajarmikhayat</p>
      </div>
      ${plate('m2h-purse','/product/salmon-purse','/img/m2-home-purse.jpg','Salmon Purse on a curved blue backdrop','Salmon Purse')}
      ${plate('m2h-bookmark','/product/salmon-bookmark','/img/m2-home-bookmark.jpg','Salmon Bookmark, salmon leather front and lining','Salmon Bookmark')}
      ${plate('m2h-tote','/product/algae-tote','/img/m2-home-tote.jpg','Algae Tote','Algae Tote')}
      <div class="m2h-gallery">
        <img src="/img/m2-home-gallery.jpg" alt="The Salmon Purse on display at the WRM launch" loading="lazy">
        <div class="m2h-gallery-txt">
          <p>WRM is a world mapped by where its materials begin</p>
          <p>For the brand’s first collection, we turned to the ocean for<br>two materials: fish leather and algae.</p>
          <p>Fish leather carries centuries of craft,<br>algae points to what materials can become.</p>
        </div>
        <p class="m2h-credit">Photo by Michelle Min</p>
      </div>
      <div class="m2h-world">
        <img src="/img/m2-home-mood.jpg" alt="WRM World mood board: sketches, samples and handbag studies" loading="lazy">
        <a class="m2-box-btn m2h-world-btn" href="/wrm-world" data-link>Explore WRM World</a>
      </div>
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
  <figure class="plate-full observe">
    <div class="pf-media">
      <img src="/img/algae-tote.jpg" alt="Algae Tote — Natural — Coming soon">
      <div class="pf-cap"><span class="name">Algae Tote</span><span class="sub">Natural</span></div>
      <div class="pf-soon">Coming Soon</div>
    </div>
    <figcaption><button class="btn" data-notify>Notify me <span class="arr">→</span></button></figcaption>
  </figure>
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

  /* Mobile shop — SHOP@2x.png: every product in Ocean Collection, as one list. */
  mShopList(){
    const item = (cls, href, img, name, sub, price) => `
      <a class="m2s-item ${cls}" href="${href}" data-link>
        <span class="m2s-img"><img src="${img}" alt="${esc(name)}" loading="lazy"></span>
        <span class="m2s-cap"><span class="m2s-name">${esc(name)}</span><span class="m2s-price">${price}</span><span class="m2s-sub">${esc(sub)}</span></span>
      </a>`;
    return `<section class="m2s" aria-label="Ocean Collection">
      <h1 class="m2-sr">Ocean Collection</h1>
      <img class="m2s-ocean" src="/img/illustration-ocean.png" alt="">
      ${item('m2s-purse','/product/salmon-purse','/img/m2-shop-purse.jpg','Salmon Purse','Natural Crust','$0')}
      ${item('m2s-bookmark','/product/salmon-bookmark','/img/m2-shop-bookmark.jpg','Salmon Bookmark','Natural Crust','$0')}
      ${item('m2s-tote','/product/algae-tote','/img/m2-shop-tote.jpg','Algae Tote','Natural','$0')}
    </section>`;
  },

  shop(){
    document.title = 'Shop — WRM';
    if(isMobile()) return pages.mShopList();
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
    if(isMobile()) return pages.mShopList();
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
    if(isMobile()) return pages.mShopList();
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
          <div class="card-txt"><button class="btn" data-notify>Notify me <span class="arr">→</span></button></div></div>
      </div>
    </div></section>`;
  },

  /* Mobile product detail — Purse@2x / Bookmark@2x / Algae_Tote@2x.png */
  mProduct(p){
    const m = M2_PRODUCT[p.id];
    return `<section class="m2p m2p-${p.id}">
      <div class="m2p-gallery" id="pdStrip" aria-label="${esc(p.name)} photos">
        ${m.images.map((src,i)=>`<div class="m2p-slide"><img src="${src}" alt="${esc(i?p.name+' — detail':m.alt)}"${i?' loading="lazy"':' fetchpriority="high"'}></div>`).join('')}
      </div>
      <div class="m2p-body">
        <div class="m2p-head"><h1 class="m2p-name">${esc(p.name)}</h1><span class="m2p-price">${m.price}</span></div>
        <p class="m2p-variant">${esc(m.variant)}</p>
        ${m.blocks.map(b=>`<p>${b.join('<br>')}</p>`).join('')}
        ${p.soon ? '' : `<button class="m2p-add" data-add="${p.id}">Add to cart</button>`}
      </div>
    </section>`;
  },

  product(id){
    const p = PRODUCTS[id];
    if(p && isMobile() && M2_PRODUCT[id]){ document.title = `${p.name} — WRM`; return pages.mProduct(p); }
    if(!p || p.soon) return pages.notFound();
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
    if(isMobile()) return `<section class="mh-original ma-original" aria-label="About the Materials">
      <img class="mh-original-art" src="/img/mobile-materials-original.png" width="1564" height="4718" alt="About the Materials: Fish Leather and Algae. Stay updated with WRM’s material explorations." fetchpriority="high">
      <button class="mh-original-hit" data-home-menu aria-label="Open menu" aria-controls="menu" style="left:2.237852%;top:0.847817%;width:10.869565%;height:4.027130%"></button>
<a class="mh-original-hit" href="/" data-link aria-label="WRM home" style="left:43.158568%;top:0.847817%;width:14.066496%;height:4.027130%"></a>
<button class="mh-original-hit" data-home-cart aria-label="Open cart" aria-controls="cart" style="left:86.956522%;top:0.847817%;width:10.869565%;height:4.027130%"></button>
<a class="mh-original-hit" href="/about-materials/fish-leather" data-link aria-label="Fish Leather — read the material story" style="left:0.000000%;top:5.086901%;width:100.000000%;height:39.720220%"></a>
<a class="mh-original-hit" href="/about-materials/algae" data-link aria-label="Algae — read the material story" style="left:0.000000%;top:44.807122%;width:100.000000%;height:44.340822%"></a>
<a class="mh-original-hit" href="/faq" data-link aria-label="Frequently asked questions" style="left:82.480818%;top:93.789741%;width:12.787724%;height:1.907588%"></a>
<a class="mh-original-hit" href="mailto:hello@withrawmaterials.com" aria-label="Contact WRM" style="left:82.480818%;top:91.564222%;width:12.787724%;height:1.907588%"></a>
<form class="mh-original-email" data-newsletter="mobile-materials" style="left:5.498721%;top:93.683764%;width:58.439898%;height:1.526070%"><input type="email" placeholder=" " required autocomplete="email" aria-label="Email — stay updated with WRM’s material explorations"><button type="submit" aria-label="Subscribe"><span aria-hidden="true">→</span></button></form>
    </section>`;
    return `<section class="pg editorial mat-page"><div class="ed-page">
      ${crumbs(isMobile() ? [['About The Materials']] : [['Home','/'],['About The Materials']])}
      <a class="mat-hero observe" href="/about-materials/fish-leather" data-link aria-label="Fish Leather">
        <img class="tex" src="/img/fish-leather-hero.jpg" alt="Fish Leather">
        <div class="mat-cap"><img class="sil" src="/img/sil-fish.png" alt=""><span>Fish Leather</span></div>
      </a>
      <a class="mat-hero observe" href="/about-materials/algae" data-link aria-label="Algae">
        <img class="tex" src="/img/algae-hero.jpg" alt="Algae">
        <div class="mat-cap"><img class="sil" src="/img/sil-seaweed.png" alt=""><span>Algae</span></div>
      </a>
    </div></section>`;
  },

  /* Edit Notes accordion: one drop-down per topic, its questions and answers inside. */
  m2Accordion(groups, label, open=false){
    return `<section class="m2-acc" aria-label="${esc(label)}">${groups.map(([topic, qa], i)=>`<div class="m2-acc-item">
      <button class="m2-acc-q" data-acc aria-expanded="${open}" aria-controls="m2acc-${label.replace(/\W+/g,'')}-${i}"><span>${esc(topic)}</span><span class="chev" aria-hidden="true">&gt;</span></button>
      <div class="m2-acc-a" id="m2acc-${label.replace(/\W+/g,'')}-${i}"${open?'':' hidden'}>${qa.map(([q,a])=>`<p class="m2-acc-qq">${esc(q)}</p><p>${esc(a)}</p>`).join('')}</div>
    </div>`).join('')}</section>`;
  },

  /* Mobile material stories — Salmon_About_Material@2x / Algae_About_Material@2x.png */
  mMaterialDetail(fish){
    const tile = (cls, href, img, label) => `<a class="m2-tile ${cls}" href="${href}" data-link><img src="${img}" alt="" loading="lazy"><span class="m2-box-btn">${label}</span></a>`;
    const body = fish ? `
        <p>Fish leather used to be part of many cultures around the world.<br>While WRM focuses on the advancement of materials, it is important to highlight that much of the newness is based on old ideas. The research and development of this collection would not have been possible without those who came before us, as well as those who are choosing the path to better the material ecosystem today.</p>
        <p>The craft of turning fish skin into leather has long been practiced by coastal and riverine Indigenous communities. Today, the leading figures in restoring this craft in North America are Janey Chang and Tracy Williams from British Columbia, Canada. Below is a section from an article written about them back in 2020.</p>
        <blockquote>"The revival of fish skin leather is more than the rediscovery of a craft. Working with our hands in traditional ways is one of the few avenues we have to connect with our ancestors," Chang says. In Japan, the Ainu crafted salmon skin into boots, which they strapped to their feet with rope. Along the Amur River in northeastern China and Siberia, Hezhen and Nivkh peoples turned the material into coats and thread. In northern Canada, the Inuit made clothing, and in Alaska, several peoples including the Alutiiq, Athabascan, and Yup'ik used fish skins to fashion boots, mittens, containers, and parkas. In the winter, Yup'ik men never left home without qasperrluk, loose-fitting, hooded fish skin parkas that could double as shelter in an emergency ... The men would prop up the hood with an ice pick and pin down the edges to make a tent-like structure. As practical and pervasive as the material was, the practice of making fish skin leather faded in the 20th century. Its loss is intertwined with colonialism and assimilation (Chloe Williams, "The Art of Turning Fish into Leather," Hakai Magazine, April 28, 2020).</blockquote>
        <p>Today, every tonne of filleted fish leaves behind roughly 40 kilograms of skin, waste unless someone chooses otherwise. Humans consumed an estimated 174 million tonnes of fish in 2024, according to the FAO's State of World Fisheries and Aquaculture report, which puts the skins left behind at somewhere around 7 million tonnes a year. WRM's ocean-caught Alaskan sockeye salmon is an industry byproduct, processed and tanned by 7 Leagues, a local tannery in Vancouver, Canada. Tasha, the founder of 7 Leagues, has taken on a mission to scale this craft and bring it to a wider audience and into new industries. We have worked together to achieve a natural finish. This is known as the "crust," the material's naked state before dyeing. Grain, scale placement, and shade shift from skin to skin, and these are intentionally preserved to highlight the material's natural differences. Our tannery distinguishes itself by using no chromium during the tanning process, which is crucial, as it leads to the compostability of the material, allowing it to safely return to soil and break down when discarded.</p>` : `
        <p class="m2m-indent">The earliest seaweed-derived creation story starts in Japan with agar, a property derived specifically from red algae. According to the FAO, "The forerunner of today's commercial product was discovered quite accidentally in about 1660 when, according to legend, a Japanese innkeeper one winter night threw some surplus seaweed jelly outdoors. After several nights and days of alternately freezing and thawing, the jelly turned into a papery, translucent substance which the innkeeper found could be reboiled in water and cooled to yield a gel equal to the original. This was the beginning of a cottage industry, a winter occupation for fishing families, and the development of the manufacture and marketing of agar in the form of sheets, bars, sticks and other shapes, known in Japan as 'Kanten (img 1).'"</p>
        <figure class="m2m-fig m2m-kanten"><img src="/img/desktop/kanten.webp" alt="Kanten jelly on a lacquer plate" loading="lazy"><figcaption>Img 1. Photo from Wikipedia</figcaption></figure>
        <p class="m2m-indent m2m-alginate">Alginate, on the other hand, is a property derived from brown algae and also the main ingredient for WRM's Algae Tote. It has no folk-discovery legend; rather, it is a modern industrial chemistry story. The discovery by Stanford in the early 1880s led to renewed and vastly increased industrial use of brown seaweed. Industrial alginate extraction began in 1929 in California, then 1939 in Europe and Japan, and the 1980s in China. Since then, seaweed has been used as a binding agent and emulsifier across cosmetics, food, and fertilizers. The idea of converting it into a plastic-replacing film or fiber is a relatively recent innovation, with early experiments beginning in the early 2000s.</p>
        <p class="m2m-sway-p">Today, Sway's innovation applies that same raw material from brown algae (alginate) to tackle a new problem: replacing petroleum plastic products, starting with plastic packaging (img.2). New science is proving that seaweed farming sequesters carbon at rates comparable to ecosystems like mangroves and seagrasses. Sway's materials use the principles of circular economy, uplifting the blue economy, green manufacturing, and healthy communities. Seaweed aquaculture offers climate-resilient economic opportunities in coastal communities threatened by climate change and overfishing, from Alaska to Indonesia and all around the world. Regenerative seaweed farming requires no fresh water, feed, or fertilizer, fueled simply by sun and ocean nutrients. While traditional plastics pollute for centuries, Sway materials are designed to return to the earth.</p>
        <figure class="m2m-fig m2m-sway"><img src="/img/desktop/sway.webp" alt="Sway the Future poly bag sample" loading="lazy"><figcaption>Img.2 Poly bag sample from Sway</figcaption></figure>`;
    return `<article class="m2m ${fish?'m2m-fish':'m2m-algae'}">
      <header class="m2m-hero">
        <img class="m2m-hero-img" src="/img/${fish?'m2-mat-fish-hero.jpg':'m2-mat-algae-hero.jpg'}" alt="${fish?'Salmon skins laid out at the tannery':'Stacked sheets of seaweed-based film'}" fetchpriority="high">
        <img class="m2m-sil" src="${fish?'/img/sil-fish.png':'/img/sil-seaweed.png'}" alt="">
        <h1 class="m2m-title">${fish?'From industry<br>byproduct to<br>hand bags':'Algae as a<br>future<br>replacement<br>to plastic'}</h1>
      </header>
      <div class="m2m-body">${body}</div>
      ${pages.m2Accordion(M2_MATERIAL_FAQ[fish?'fish':'algae'], fish?'Salmon leather questions':'Algae questions')}
      ${fish?'<p class="m2m-more">More questions?<br>Visit the <a href="/faq" data-link>FAQ page</a>.</p>':''}
      <div class="m2-tiles">
        ${tile('m2-tile-purse','/shop','/img/m2-tile-purse.jpg','View collection')}
        ${fish ? tile('m2-tile-algae','/about-materials/algae','/img/m2-tile-algae.jpg','Explore algae')
               : tile('m2-tile-fish','/about-materials/fish-leather','/img/m2-tile-fish.jpg','Explore<br>fish leather')}
      </div>
    </article>`;
  },

  materialDetail(which){
    const fish = which==='fish-leather';
    document.title = (fish?'Fish Leather':'Algae') + ' — WRM';
    if(isMobile()) return pages.mMaterialDetail(fish);
    return `<section class="pg editorial mat-page"><div class="ed-page">
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

  /* Mobile WRM World — WRM_WORLD@2x.png collage: original photos placed on the measured
     artboard grid, numbered captions as real text. */
  world(){
    document.title = 'WRM World';
    const pic = (cls, src, alt) => `<img class="m2w-pc ${cls}" src="/img/${src}" alt="${alt}" loading="lazy">`;
    const cap = (cls, html) => `<p class="m2w-cap ${cls}">${html}</p>`;
    return `<section class="m2w" aria-label="WRM World — material explorations">
      <h1 class="m2-sr">WRM World</h1>
      <img class="m2w-pc m2w-top" src="/img/m2-world-top.jpg" alt="Ocean drawing and twelve algae yarn crochet samples" fetchpriority="high">
      ${cap('m2w-c1','01. Algae yarn crochet samples')}
      ${pic('m2w-yarn','m2-world-yarn.jpg','A coil of charcoal dyed algae yarn')}
      ${cap('m2w-c2','02. Charcoal dyed algae yarn')}
      ${pic('m2w-dyedbag','m2-world-dyedbag.jpg','A purse wrapped in dyed cloth with the WRM mark')}
      ${pic('m2w-note','m2-world-note.jpg','Handwritten research notes')}
      ${pic('m2w-vase','m2-world-vase.jpg','Glass vase with relief fish')}
      ${pic('m2w-wall','m2-world-wallpaper.jpg','Wallpaper with a Wiener Werkstätte fabric display photograph, a design note and an algae yarn weaving')}
      ${cap('m2w-c3','03. Algae yarn weaving')}
      ${cap('m2w-c4','04. Stella’s childhood<br>bedroom wallpaper')}
      ${pic('m2w-purse','m2-world-purse.jpg','Crochet algae yarn purse')}
      ${pic('m2w-calder','m2-world-calder.jpg','Alexander Calder wire fishbowl sculpture')}
      ${pic('m2w-red','m2-world-red.jpg','Shoe study with a pink note')}
      ${pic('m2w-sticky','m2-world-sticky.jpg','Sticky note with a handbag sketch')}
      ${cap('m2w-c5 m2w-light','05. Crochet algae yarn purse')}
      ${cap('m2w-c6 m2w-light','06. Alexander Calder')}
      <a class="m2w-learn" href="/about-materials" data-link><img src="/img/m2-world-tex-fish.jpg" alt=""><img src="/img/m2-world-tex-algae.jpg" alt=""><span class="m2-box-btn">Learn more about the materials</span></a>
    </section>`;
  },

  faq(){
    document.title = 'FAQ — WRM';
    if(isMobile()) return `<section class="m2f"><h1 class="m2f-title">FAQ</h1>${pages.m2Accordion([['Shipping', M2_FAQ]], 'Frequently asked questions', true)}</section>`;
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

/* ---------- Pre-launch gate ----------
   Visitors only see the "Ocean season coming soon" landing on every URL. Admins
   unlock the full site per browser via the faint lock in the corner. This is a
   soft client-side curtain (only a SHA-256 of the password ships), not real
   access control: anyone reading the JS can still reach the page code. */
const ADMIN_HASH = '128b70a337eccc60b3022d9b1860c3b512830364b39a6b3cf7a8130abfa33ee3';
const ADMIN_KEY = 'wrm-admin-unlocked';
const isUnlocked = () => { try{ return localStorage.getItem(ADMIN_KEY) === ADMIN_HASH; }catch(e){ return false; } };
const LOCK_SVG = open => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="${open?'M8 11V7.5a4 4 0 0 1 7.6-1.7':'M8 11V7.5a4 4 0 0 1 8 0V11'}"/></svg>`;
const adminLock = document.createElement('div');
adminLock.className = 'admin-lock';
document.body.appendChild(adminLock);
function drawAdminLock(){
  const open = isUnlocked();
  adminLock.innerHTML = `<button class="admin-lock-btn" type="button" aria-label="${open?'Lock site (show landing page)':'Admin access'}">${LOCK_SVG(open)}</button>
    ${open?'':`<form class="admin-lock-form" hidden><input type="password" autocomplete="current-password" placeholder="Password" aria-label="Admin password"><button type="submit">Enter</button></form>`}`;
}
adminLock.addEventListener('click', e => {
  if(!e.target.closest('.admin-lock-btn')) return;
  if(isUnlocked()){ localStorage.removeItem(ADMIN_KEY); drawAdminLock(); render(location.pathname); return; }
  const f = adminLock.querySelector('form'); f.hidden = !f.hidden; if(!f.hidden) f.querySelector('input').focus();
});
adminLock.addEventListener('submit', async e => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
  const hex = [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
  if(hex === ADMIN_HASH){ localStorage.setItem(ADMIN_KEY, hex); drawAdminLock(); render(location.pathname); }
  else { input.value=''; input.placeholder='Wrong password'; adminLock.classList.remove('shake'); void adminLock.offsetWidth; adminLock.classList.add('shake'); }
});
drawAdminLock();

function landing(){
  document.title = 'WRM — Ocean season coming soon';
  return `<section class="hero landing-hero">
  <div class="hero-card">
    <div class="logo-wrap reveal"><img src="/img/wrm-logo-dark.png" alt="WRM — With Raw Materials"></div>
    <h1 class="headline reveal d2">Ocean season <span class="italic">coming</span> <span class="soft">soon.</span></h1>
    <form class="notify reveal d3" data-newsletter="landing">
      <input type="email" required placeholder="Your email" autocomplete="email" aria-label="Email">
      <button type="submit"><span data-label>Notify me</span> <span class="arr">→</span></button>
    </form>
  </div>
  <span class="scroll-hint reveal d4">Chapter I</span>
</section>`;
}

let io;
function render(path, y=0){
  closeMenu(); closeCart();
  const gated = !isUnlocked();
  document.body.classList.toggle('landing', gated);
  if(gated){
    document.body.classList.remove('m2','d2','m2-light','mobile-materials-original');
    app.innerHTML = `<div class="page">${landing()}</div>`;
    window.scrollTo({top:0, behavior:'instant'});
    return;
  }
  let html = isMobile() ? null : window.WRMDesktop.render(path.replace(/\/$/,'') || '/');
  if(html === null) for(const [re,fn] of routes){ const m = path.match(re); if(m){ html = fn(m); break; } }
  app.innerHTML = `<div class="page">${html ?? pages.notFound()}</div>`;
  const isHome = path === '/';

  const isProductDetail = /^\/product\//.test(path);
  const isAboutMaterials = /^\/about-materials/.test(path); /* mobile_About_Material-08/09/10.png: same neutral off-white treatment as product detail pages, not the warm --paper beige */
  const isProductList = isMobile() && path.replace(/\/$/,'') === '/shop/ocean-season/fish-leather'; /* mobile_Product_List_Page.png: nav/body/footer are the same seamless neutral off-white as product detail pages, not the warm --paper beige — measured live rgba(232,223,200,.86) nav vs mockup rgb(~234,233,231) */
  const isShop = isMobile() && (path==='/shop' || path==='/shop/'); /* mobile_SHOP.png: footer is the same neutral off-white (~rgb 235,234,232) as product detail/list pages, not the warm --paper beige — measured live rgb(226,217,195) footer vs mockup rgb(~235,234,232) */
  /* The new mobile home (Stella's reference layout) reuses the standard signup line. */
  foot.querySelector('.foot-lead').textContent = isMobile() ? 'Stay updated with WRM’s material explorations.' : 'Sign up to stay updated with WRM’s material explorations.';
  /* Mobile v2 (Drive redesign): every mobile page is real HTML except About Materials,
     whose new mockup is unchanged from the supplied full-resolution artwork. */
  document.body.classList.toggle('m2', isMobile());
  document.body.classList.toggle('d2', !isMobile());
  document.body.classList.toggle('m2-light', isMobile() && (isHome || /^\/about-materials\/(fish-leather|algae)\/?$/.test(path)));
  const isMobileMaterials = isMobile() && path.replace(/\/$/,'') === '/about-materials';
  document.body.classList.toggle('mobile-materials-original', isMobileMaterials);
  foot.classList.toggle('hide', isMobileMaterials);
  foot.classList.toggle('foot-home', isHome); /* mobile_HOME.png shows a distinct footer style (sans-serif lead, wider link spacing) vs mobile_SHOP/_Purse/etc */
  foot.classList.toggle('foot-neutral', isProductDetail || (isMobile() && (isAboutMaterials || isProductList || isShop))); /* mobile_Purse.png / mobile_Bookmark.png / mobile_About_Material-08/09/10.png / mobile_Product_List_Page.png / mobile_SHOP.png: footer continues the neutral off-white/textured tone, not the warm --paper beige */
  nav.classList.toggle('nav-neutral', isMobile() && (isProductDetail || isAboutMaterials || isProductList)); /* mobile_Purse.png / mobile_Bookmark.png / mobile_About_Material-08/09/10.png / mobile_Product_List_Page.png: header bar is the SAME seamless neutral off-white paper texture as the page body below it — no beige blur bar, no dividing line */
  nav.classList.toggle('on-dark', isHome || (isMobile() && (path==='/shop' || path==='/shop/' || path.replace(/\/$/,'')==='/shop/ocean-season')));
  renderCart();
  io?.disconnect();
  io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
  app.querySelectorAll('.observe').forEach(el=>io.observe(el));
  const strip = $('#pdStrip');

  if(strip && $('#pdN')) strip.addEventListener('scroll', ()=>{
    const i = Math.round(strip.scrollLeft / strip.clientWidth);
    $('#pdN').textContent = `${i+1} / ${strip.children.length}`;
  }, {passive:true});
  window.scrollTo({top:y, behavior:'instant'});
  onScroll();
}
function go(path, push=true){ if(push){ history.replaceState({path:location.pathname, y:scrollY},''); history.pushState({path},'',path);} render(path); }
if('scrollRestoration' in history) history.scrollRestoration='manual';
window.addEventListener('popstate', e => render(e.state?.path || location.pathname, e.state?.y||0));

/* ---------- Events ---------- */
document.addEventListener('click', e => {
  if(e.target.closest('[data-home-menu]')){ openMenu(); return; }
  if(e.target.closest('[data-home-cart]')){ openCart(); return; }
  const shop = e.target.closest('[data-shop-link]'); if(shop){ e.preventDefault(); e.stopPropagation(); go('/shop'); return; }
  const a = e.target.closest('a[data-link]'); if(a){ e.preventDefault(); go(a.getAttribute('href')); return; }
  const tg = e.target.closest('[data-toggle]'); if(tg){ const open = tg.getAttribute('aria-expanded')==='true'; tg.setAttribute('aria-expanded',String(!open)); tg.nextElementSibling.classList.toggle('open',!open); return; }
  const ad = e.target.closest('[data-add]'); if(ad){ add(ad.dataset.add); openCart(); return; }
  const q = e.target.closest('[data-qty]'); if(q){ setQty(q.dataset.qty, +q.dataset.d); return; }
  const rm = e.target.closest('[data-remove]'); if(rm){ remove(rm.dataset.remove); return; }
  const th = e.target.closest('[data-thumb]'); if(th){ const i=+th.dataset.thumb, p=PRODUCTS[location.pathname.split('/')[2]]; $('#pdImg').src=p.images[i]; $('#pdN').textContent=`${i+1} / ${p.images.length}`; document.querySelectorAll('[data-thumb]').forEach(b=>b.setAttribute('aria-current',String(b===th))); return; }
  const ac = e.target.closest('[data-acc]'); if(ac){ const open = ac.getAttribute('aria-expanded')==='true'; ac.setAttribute('aria-expanded',String(!open)); ac.nextElementSibling.hidden = open; return; }
  const fq = e.target.closest('.faq-q'); if(fq){ const it=fq.parentElement, open=it.classList.contains('open'); document.querySelectorAll('.faq-item').forEach(x=>{x.classList.remove('open'); x.querySelector('.faq-q').setAttribute('aria-expanded','false');}); if(!open){ it.classList.add('open'); fq.setAttribute('aria-expanded','true'); } return; }
  const nt = e.target.closest('[data-notify]'); if(nt){ toast('Sign up below and we\'ll tell you when it\'s ready.'); foot.querySelector('input')?.focus(); return; }
  if(e.target.closest('#checkout')){ location.href = 'mailto:hello@withrawmaterials.com?subject=' + encodeURIComponent('Order enquiry — WRM') + '&body=' + encodeURIComponent(cart.map(i=>`${i.qty} × ${PRODUCTS[i.id].name} (${PRODUCTS[i.id].variant})`).join('\n') + `\n\nTotal ${money(total())}`); return; }
});
document.addEventListener('keydown', e => {
  if((e.key==='Enter'||e.key===' ') && e.target.matches('[data-shop-link]')){
    e.preventDefault(); go('/shop');
  }
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

function onScroll(){
  const mobHome = isMobile() && nav.classList.contains('on-dark');
  nav.classList.toggle('solid', !mobHome && (window.scrollY > 24 || location.pathname !== '/'));
  /* Desktop: the header is fixed, so its white "on-dark" treatment must only stay while
     it actually overlaps the dark hero at the top of the page. Past the hero the content
     is light and white text/logo would be invisible, so drop back to dark ink. */
  /* Desktop v2: the header stays transparent, so its ink follows whatever is under it —
     white over sections marked data-tone="light" (dark photos), black elsewhere. */
  if(!isMobile()){
    const y = nav.getBoundingClientRect().height / 2;
    const under = (x) => document.elementsFromPoint(x, y).find(el => !nav.contains(el) && el !== nav);
    const tone = (x) => under(x)?.closest('[data-tone]')?.dataset.tone === 'light';
    nav.classList.toggle('d2-ink-light', tone(innerWidth * .5));
    nav.classList.toggle('d2-links-light', tone(innerWidth * .1));
    nav.classList.toggle('d2-cart-light', tone(innerWidth * .95));
  }
}
window.addEventListener('scroll', onScroll, {passive:true});
window.addEventListener('resize', ()=>{ if(!isMobile()) onScroll(); }, {passive:true});

window.matchMedia('(max-width:760px)').addEventListener('change', ()=>{
  foot.querySelector('.foot-lead').textContent = 'Sign up to stay updated with WRM’s journey';
  buildMenu(); render(location.pathname, scrollY);
});

/* ---------- Init ---------- */
buildMenu();
render(location.pathname);
})();
