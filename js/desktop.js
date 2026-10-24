/* Desktop v2 (>760px) — Stella's new Drive desktop mockups (design-ref/desktop-v2/*@2x.png,
   1440px artboards). Photos are the same originals mobile uses, re-cropped at desktop
   resolution by scripts/build-desktop-v2-assets.py (img/d2-*.jpg). Mobile continues through
   the shared router in app.js. Sections carrying data-tone="light" sit under white header ink. */
window.WRMDesktop = (() => {
  'use strict';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const photo = (name, alt, eager=false, cls='') => `<img${cls?` class="${cls}"`:''} src="/img/d2-${name}.jpg" alt="${esc(alt)}" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  const ocean = (cls) => `<img class="${cls}" src="/img/illustration-ocean.png" alt="" aria-hidden="true">`;
  const boxLink = (href, label, cls='') => `<a class="d2-box ${cls}" href="${href}" data-link>${label}</a>`;

  /* Home@2x.png */
  function home(){
    document.title = 'WRM — With Raw Materials';
    const tile = (cls, href, name, alt, label) => `<a class="d2h-tile ${cls}" href="${href}" data-link data-tone="light">${photo(name, alt)}<span class="d2-label">${label}</span></a>`;
    return `<div class="d2-page d2-home">
      <section class="d2h-hero" data-tone="light" aria-label="Chapter I: Ocean">
        ${photo('home-hero','Salmon Purse in natural crust salmon leather',true)}
        ${ocean('d2h-ocean')}
        <h1 class="d2h-chapter">Chapter I<span class="d2-sr"> Ocean</span></h1>
        <p class="d2h-lede">WRM (pronounced werm, stands for with raw materials)<br>is a world mapped by where its materials begin</p>
        <p class="d2h-credit">Photos by Sahra Jajarmikhayat</p>
      </section>
      <section class="d2h-collection" aria-labelledby="d2h-coll">
        <h2 class="d2-collection-title" id="d2h-coll">The Collection</h2>
        ${tile('d2h-purse','/product/salmon-purse','home-purse','Salmon Purse on a curved blue backdrop','Salmon Purse')}
        ${tile('d2h-bookmark','/product/salmon-bookmark','home-bookmark','Salmon Bookmark, salmon leather front and lining','Salmon Bookmark')}
      </section>
      ${tile('d2h-tote','/product/algae-tote','home-tote','Algae Tote','Algae Tote')}
      <section class="d2h-gallery" data-tone="light">
        <div class="d2h-gallery-txt">
          <h2>For the brand’s first collection,</h2>
          <p>WRM turned to the ocean for two materials:<br>fish leather and algae.</p>
          <p>Fish leather carries centuries of craft,<br>algae points to what materials can become.<br>Together, they begin a new story for the objects we live with.</p>
        </div>
        ${photo('home-gallery','The Salmon Purse on display at the WRM launch')}
      </section>
      <section class="d2h-world" data-tone="light">
        ${photo('home-mood','WRM World mood board: sketches, samples and handbag studies')}
        ${boxLink('/wrm-world','Explore WRM World','d2h-world-btn')}
      </section>
    </div>`;
  }

  /* SHOP@2x.png */
  function shop(){
    document.title = 'Shop — WRM';
    const cap = (name, sub) => `<span class="d2-cap"><span class="d2-cap-name">${name}</span><span class="d2-cap-price" data-card-price>$0</span><span class="d2-cap-sub">${sub}</span></span>`;
    const card = (cls, href, name, alt, title, sub) => `<a class="d2s-card ${cls}" href="${href}" data-link>${photo(name, alt)}${cap(title, sub)}</a>`;
    return `<div class="d2-page d2-shop">
      <h1 class="d2-sr">Shop — Ocean Collection</h1>
      ${ocean('d2s-ocean')}
      ${card('d2s-purse','/product/salmon-purse','shop-purse','Salmon Purse lying on a white surface','Salmon Purse','Natural Crust')}
      <a class="d2s-dyedbag" href="/product/salmon-purse" data-link>${photo('shop-dyedbag','Salmon Purse wrapped in its WRM dust cloth',true)}</a>
      <a class="d2s-bookmark" href="/product/salmon-bookmark" data-link data-tone="light">${photo('shop-bookmark','Salmon Bookmark, salmon leather front and lining')}</a>
      ${card('d2s-bookbm','/product/salmon-bookmark','shop-bookbm','Salmon Bookmark on a book','Salmon Bookmark','Natural Crust')}
      <a class="d2s-tote" href="/product/algae-tote" data-link>${photo('shop-tote','Translucent Algae Tote')}<span class="d2s-tote-label">Algae Tote</span></a>
      <section class="d2s-collection" aria-labelledby="d2s-coll">
        <h2 class="d2-collection-title" id="d2s-coll">The Collection</h2>
        ${card('d2s-c-purse','/product/salmon-purse','shop-c-purse','Salmon Purse','Salmon Purse','Natural Crust')}
        ${card('d2s-c-bookmark','/product/salmon-bookmark','shop-c-bookmark','Salmon Bookmark','Salmon Bookmark','Natural Crust')}
        ${card('d2s-c-tote','/product/algae-tote','shop-c-tote','Algae Tote','Algae Tote','Natural')}
      </section>
    </div>`;
  }

  /* Salmon Purse@2x / Bookmark@2x / Algae Tote@2x.png. Copy is verbatim from the mockups. */
  const PRODUCTS = {
    'salmon-purse': {name:'Salmon Purse', photos:[
        ['pd-purse-1','Salmon Purse, front, in natural crust salmon leather'],
        ['pd-purse-3','Salmon leather grain, close'],['pd-purse-4','Corner of the Salmon Purse on a blue backdrop'],['pd-purse-5','Salmon Purse carried in a car']],
      blocks:[['Natural Crust'],
        ['Your classic evening purse made with ocean-caught salmon leather. Fits your essentials. Pleated sides, lined with Korean hemp, finished with invisible magnet closure.'],
        ['Please note the textures and colors of the bags vary piece to piece. Each skin is unique and no two pieces are identical.'],
        ['Product Detail','Made in San Francisco'],
        ['Dimensions','H: 6″ x W: 7 ″ D: 1.5″','Strap Drop: 5.25″'],
        ['Material and Care','Exterior Body: 100% Ocean-Caught Alaskan Sockeye Salmon','Interior: 100% Korean Hemp fabric'],
        ['Treat like any other leather products, and see a specialist for cleaning. Avoid direct sunlight']],
      more:'<p class="d2p-more">Learn more about fish leather <a href="/about-materials/fish-leather" data-link><em>here</em></a></p>'},
    'salmon-bookmark': {name:'Salmon Bookmark', photos:[
        ['pd-bm-1','Salmon Bookmark lining with its WITH RAW MATERIALS label on an open book'],['pd-bm-2','Salmon Bookmark, salmon leather front and lining'],
        ['pd-bm-3','Strips of tanned salmon skin']],
      blocks:[['Natural Crust'],
        ['A small piece of fish leather for your everyday reading.','Lined with horse hair classically used for suiting.'],
        ['Textures and colors of the bags vary piece to piece. Each skin is unique and no two pieces are identical.'],
        ['Product Detail','Made in San Francisco'],
        ['Dimensions','H: 6.5″ x W: 2 ″'],
        ['Material and Care','Exterior: 100% Ocean-Caught Alaskan Sockeye Salmon','Lining: 100% Korean Hemp fabric'],
        ['Treat like any other leather products, and see a specialist for cleaning. Avoid direct sunlight']],
      more:'<p class="d2p-more">Learn more about fish leather <a href="/about-materials/fish-leather" data-link><em>here</em></a></p>'},
    'algae-tote': {name:'Algae Tote', soon:true, photos:[
        ['pd-tote-1','Algae Tote, translucent seaweed-based sheet, backlit'],['pd-tote-2','Algae Tote in natural, lit from the side']],
      blocks:[['Natural'],
        ['Your classic everyday tote made with algae. The seaweed is dehydrated and processed into a powder form, which then formulated and turned into sheets by Sway (learn more about Sway in our <a href="/about-materials/algae" data-link>materials page</a>).'],
        ['You can expect a waxed canvas-like hand feel. The waxiness will disappear with wear. Please note the textures and colors of the bags vary piece to piece.'],
        ['Product Detail','Manufactured in San Francisco'],
        ['Dimensions','H: 6″ x W: 7 ″ D: 1.5″','Strap Drop: 5.25″'],
        ['Material','Exterior Body: 100% compostable algae-based sheet'],
        ['Care','Avoid moisture and direct sunlight','Please see <a href="/faq" data-link>FAQ page</a> for detailed instructions on how to care for this material.']],
      more:''}
  };
  function product(id){
    const p = PRODUCTS[id];
    document.title = `${p.name} — WRM`;
    return `<div class="d2-page d2-product d2p-${id}" data-product="${id}">
      <div class="d2p-gallery">${p.photos.map(([n,alt],i)=>photo(n, alt, i===0, `d2p-ph d2p-ph${i+1}`)).join('')}</div>
      <div class="d2p-info">
        <div class="d2p-head"><h1>${p.name}</h1><span class="d2p-price" data-price>$0.00</span></div>
        <div class="d2p-copy">
          ${p.blocks.map(b=>`<p>${b.join('<br>')}</p>`).join('')}
          ${p.more}
          <button class="d2p-add" data-add disabled>Add to cart</button>
        </div>
      </div>
    </div>`;
  }

  /* Mateiral Story@2x.png */
  function materials(){
    document.title = 'About the Materials — WRM';
    const panel = (cls, href, name, sil, label) => `<a class="d2m-panel ${cls}" href="${href}" data-link data-tone="light">${photo(name,'',true)}<img class="d2m-sil" src="${sil}" alt=""><h2>${label}</h2></a>`;
    return `<div class="d2-page d2-materials">
      <h1 class="d2-sr">About the Materials</h1>
      ${panel('d2m-fish','/about-materials/fish-leather','mat-fish','/img/sil-fish.png','Fish Leather')}
      ${panel('d2m-algae','/about-materials/algae','mat-algae','/img/sil-seaweed.png','Algae')}
    </div>`;
  }

  /* Fish Leather Mateiral Story@2x / Algae Material Story@2x.png */
  function materialStory(fish){
    document.title = (fish?'Fish Leather':'Algae') + ' — WRM';
    const body = fish ? `
      <div class="d2-essay d2-essay-fish">
        <p>Fish leather used to be part of many cultures around the world. While WRM focuses on the advancement of materials, it is important to highlight that much of the newness is based on old ideas. The research and development of this collection would not have been possible without those who came before us, as well as those who are choosing the path to better the material ecosystem today. The craft of turning fish skin into leather has long been practiced by coastal and riverine Indigenous communities. Today, the leading figures in restoring this craft in North America are Janey Chang and Tracy Williams from British Columbia, Canada. Below is a section from an article written about them back in 2020. "The revival of fish skin leather is more than the rediscovery of a craft. Working with our hands in traditional ways is one of the few avenues we have to connect <span class="d2-ainu" role="figure" aria-label="Img 01">${photo('fish-ainu','The Ainu fishing salmon and trout from dugout canoes')}<span class="d2-ainu-cap">Img 01. The Ainu fished salmon and trout on rivers using gaff-like spears.<br>Photo by The Protected Art Archive | Alamy Stock Photo</span></span>with our ancestors,"&nbsp; Chang says. In Japan, the Ainu (img. 01) crafted salmon skin into boots, which they strapped to their feet with rope. Along the Amur River in northeastern China and Siberia, Hezhen and Nivkh peoples turned the material into coats and thread. In northern Canada, the Inuit made clothing, and in Alaska, several peoples including the Aluttiiq, Athabascan, and Yup'ik used fish skins to fashion boots, mittens, containers, and parkas. In the winter, Yup'ik men never left home without qasperrluk, loose-fitting, hooded fish skin parkas that could double as shelter in an emergency ...&nbsp; The men would prop up the hood with an ice pick and pin down the edges to make a tent-like structure. As practical and pervasive as the material was, the practice of making fish skin leather faded in the 20th century. Its loss is intertwined with colonialism and assimilation (Chloe Williams, "The Art of Turning Fish into Leather, "Hakai Magazine, April 28, 2020). Today, every tonne of filleted fish leaves behind roughly 40 kilograms of skin, waste unless someone chooses otherwise. Humans consumed an estimated 174 million tonnes of fish in 2024, according to the FAO's State of World Fisheries and Aquaculture report, which puts the skins left behind at somewhere around 7 million tonnes a year. WRM's ocean-caught Alaskan sockeye salmon is an industry byproduct, processed and tanned by 7 Leagues, a local tannery in Vancouver, Canada. Tasha, the founder of 7 Leagues, has taken on a mission to scale this craft and bring it to a wider audience and into new industries. We have worked together to achieve a natural finish. This is known as the "crust," the material's naked state before dyeing. Grain, scale placement, and shade shift from skin to skin, and these are intentionally preserved to highlight the material's natural differences. Our tannery distinguishes itself by using no chromium during the tanning process, which is crucial, as it leads to the compostability of the material, allowing it to safely return to soil and break down when discarded.</p>
      </div>` : `
      <div class="d2-essay d2-essay-algae">
        <p>The earliest seaweed-derived creation story starts in Japan with agar, a property derived specifically from red algae. According to the FAO, "The forerunner of today's commercial product was discovered quite accidentally in about 1660 when, according to legend, a Japanese innkeeper one winter night threw some surplus seaweed jelly outdoors. After several nights and days of alternately freezing and thawing, the jelly turned into a papery, translucent substance which the innkeeper found could be reboiled in water and cooled to yield a gel equal to the original. This was the beginning of a cottage industry, a winter occupation for fishing families, and the development of the manufacture and marketing of agar in the form of sheets, bars, sticks and other shapes, known in Japan as 'Kanten (img 01).'"</p>
        <figure class="d2-fig d2-kanten"><img src="/img/desktop/kanten.webp" alt="Kanten jelly on a lacquer plate" loading="lazy"><figcaption>Img 01. Photo from Wikipedia</figcaption></figure>
        <p>Alginate, on the other hand, is a property derived from brown algae and also the main ingredient for WRM's Algae Tote. It has no folk-discovery legend; rather, it is a modern industrial chemistry story. The discovery by Stanford in the early 1880s led to renewed and vastly increased industrial use of brown seaweed. Industrial alginate extraction began in 1929 in California, then 1939 in Europe and Japan, and the 1980s in China. Since then, seaweed has been used as a binding agent and emulsifier across cosmetics, food, and fertilizers. The idea of converting it into a plastic-replacing film or fiber is a relatively recent innovation, with early experiments beginning in the early 2000s.</p>
        <p>Today, Sway's innovation applies that same raw material from brown algae (alginate) to tackle a new problem: replacing petroleum plastic products, starting with plastic packaging (img. 02). New science is proving that seaweed farming sequesters carbon at rates comparable to ecosystems like mangroves and seagrasses. Sway's materials use the principles of circular economy, uplifting the blue economy, green manufacturing, and healthy communities. Seaweed aquaculture offers climate-resilient economic opportunities in coastal communities threatened by climate change and overfishing, from Alaska to Indonesia and all around the world. Regenerative seaweed farming requires no fresh water, feed, or fertilizer, fueled simply by sun and ocean nutrients. While traditional plastics pollute for centuries, Sway materials are designed to return to the earth.</p>
        <figure class="d2-fig d2-sway"><img src="/img/desktop/sway.webp" alt="Sway the Future poly bag sample" loading="lazy"><figcaption>Img.02 Poly bag sample from Sway</figcaption></figure>
      </div>`;
    const panel = (cls, href, name, label) => `<a class="d2-panel ${cls}" href="${href}" data-link data-tone="light">${photo(name,'')}<span class="d2-box">${label}</span></a>`;
    return `<article class="d2-page d2-story ${fish?'d2-story-fish':'d2-story-algae'}">
      <header class="d2-story-hero">
        ${photo(fish?'fish-hero':'algae-hero', fish?'Salmon skins laid out at the tannery':'Stacked sheets of seaweed-based film', true, 'd2-story-photo')}
        <div class="d2-story-title"><p class="d2-story-chapter">Chapter 1<br>Ocean</p><h1>${fish?'From industry<br>byproduct to<br>hand bags':'Algae as<br>a future<br>replacement<br>to plastic'}</h1></div>
      </header>
      ${body}
      <p class="d2-more">More questions?&nbsp; Visit the <a href="/faq" data-link>FAQ</a> page.</p>
      <nav class="d2-panels" aria-label="Continue">
        ${panel('d2-panel-tote','/shop',fish?'fish-p-tote':'algae-p-tote','Back to Ocean Season')}
        ${fish ? panel('d2-panel-algae','/about-materials/algae','fish-p-algae','Explore Algae Material')
               : panel('d2-panel-fish','/about-materials/fish-leather','algae-p-fish','Explore Fish Leather')}
      </nav>
    </article>`;
  }

  /* WRM WORLD@2x.png — collage of the original photographs on the measured artboard grid. */
  function world(){
    document.title = 'WRM World';
    const cap = (cls, text) => `<p class="d2w-cap ${cls}">${text}</p>`;
    return `<div class="d2-page d2-world" aria-label="WRM World — material explorations">
      <h1 class="d2-sr">WRM World</h1>
      <div class="d2w-paper d2w-paper-strip"></div>
      <div class="d2w-paper d2w-paper-left"></div>
      <img class="d2w-ph d2w-crochet" src="/img/desktop/world-clear-bag.webp" width="703" height="898" alt="Crocheted algae yarn bag" fetchpriority="high" decoding="async">
      ${cap('d2w-c1 d2w-light','01. Crocheted algae yarn exploration')}
      <div class="d2w-ocean-clip">${ocean('d2w-ocean')}</div>
      ${photo('world-samples','Twelve algae yarn crochet samples',true,'d2w-ph d2w-samples')}
      ${cap('d2w-c2','02. Algae yarn crochet samples')}
      ${photo('world-dye','Spool of algae yarn dyed with activated charcoal, and a handwritten research note',false,'d2w-ph d2w-dye')}
      ${cap('d2w-c3','03. Spool of algae yarn dyed with activated charcoal')}
      ${photo('world-vase','Glass vase with fish in relief',false,'d2w-ph d2w-vase')}
      ${cap('d2w-c4','04. Fish Jar by')}
      ${photo('world-wall','Stella’s childhood bedroom wallpaper with a Wiener Werkstätte display photograph, a design note and an algae yarn weaving',false,'d2w-ph d2w-wall')}
      ${cap('d2w-c5 d2w-light','05. Stella’s childhood bedroom wallpaper')}
      ${cap('d2w-c6 d2w-light','06. Algae yarn weaving with quartz beads')}
      ${photo('world-wire','Crochet algae yarn purse with wool handle, a shoe study with a material note, a sticky-note sketch and an Alexander Calder wire sculpture',false,'d2w-ph d2w-wire')}
      ${cap('d2w-c7 d2w-light','07. Crochet algae yarn purse with wool handle')}
      ${cap('d2w-c8 d2w-light','08. Alexander Calder')}
      <a class="d2-panel d2w-learn" href="/about-materials" data-link data-tone="light">${photo('world-learn','')}<span class="d2-box">Learn more about the materials</span></a>
      <a class="d2-panel d2w-back" href="/shop" data-link data-tone="light">${photo('world-back','')}<span class="d2-box">Back to Ocean Season</span></a>
    </div>`;
  }

  /* FAQ@2x.png is an empty page between header and footer (no copy supplied). The questions
     are the existing FAQ data mobile uses (shipping + the material FAQs), in drop-downs. */
  function faq(){
    document.title = 'FAQ — WRM';
    const data = window.WRMData || {};
    const groups = [['Shipping', data.M2_FAQ || []], ...((data.M2_MATERIAL_FAQ?.fish)||[]).map(([t,qa])=>[`Fish Leather — ${t}`, qa]), ...((data.M2_MATERIAL_FAQ?.algae)||[]).map(([t,qa])=>[`Algae — ${t}`, qa])];
    return `<div class="d2-page d2-faq">
      <h1>FAQ</h1>
      <div class="d2-acc">${groups.map(([topic, qa], i)=>`<div class="d2-acc-item">
        <button class="d2-acc-q" data-acc aria-expanded="${i===0}" aria-controls="d2acc-${i}"><span>${esc(topic)}</span><span class="d2-chev" aria-hidden="true"></span></button>
        <div class="d2-acc-a" id="d2acc-${i}"${i===0?'':' hidden'}>${qa.map(([q,a])=>`<p class="d2-acc-qq">${esc(q)}</p><p>${esc(a)}</p>`).join('')}</div>
      </div>`).join('')}</div>
    </div>`;
  }

  function render(path){
    if(path==='/') return home();
    if(path==='/shop') return shop();
    const pd = path.match(/^\/product\/(salmon-purse|salmon-bookmark|algae-tote)$/); if(pd) return product(pd[1]);
    if(path==='/about-materials') return materials();
    if(path==='/about-materials/fish-leather') return materialStory(true);
    if(path==='/about-materials/algae') return materialStory(false);
    if(path==='/wrm-world') return world();
    if(path==='/faq') return faq();
    return null;
  }
  return {render};
})();
