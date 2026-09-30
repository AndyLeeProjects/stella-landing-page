/* Desktop-only reference layouts. Mobile continues through the existing router. */
window.WRMDesktop = (() => {
  'use strict';
  const image = (name, alt, eager=false) => `<img src="/img/desktop/${name}.webp" alt="${alt}" ${eager?'fetchpriority="high"':'loading="lazy"'}>`;
  /* Every OCEAN COLLECTION label on the home page opens the Shop page. */
  const caption = (title, href, cls='') => `<div class="d-caption ${cls}"><h2>${title}</h2><a href="/shop" data-link>OCEAN COLLECTION</a></div>`;
  function home(){
    document.title = 'WRM — With Raw Materials';
    return `<div class="d-home">
      <section class="d-home-hero">${image('hero','Salmon purse in fish leather',true)}
        <div class="d-caption"><h1>SALMON PURSE</h1><a href="/shop" data-link>OCEAN COLLECTION</a></div>
        <p class="d-credit">Photos by Sahra Jajarmikhayat</p>
      </section>
      <section class="d-home-pair">
        <a href="/product/salmon-purse" data-link>${image('purse-editorial','Salmon purse on a curved blue backdrop')}</a>
        <div><a class="d-small-link" href="/about-materials/fish-leather" data-link>SALMON LEATHER</a><a href="/product/salmon-bookmark" data-link>${image('bookmark','Salmon leather bookmark, front and lining')}</a></div>
      </section>
      <section class="d-home-bookmark">${image('bookmark-book','Salmon bookmark on an open book')}${caption('SALMON BOOKMARK','/product/salmon-bookmark')}</section>
      <section class="d-home-tote">${image('tote','Translucent algae tote')}${caption('ALGAE TOTE','/about-materials/algae')}</section>
      <section class="d-home-ocean">
        ${image('ocean-scales','Overlapping salmon skins')}
        <div class="d-ocean-art"><img src="/img/illustration-ocean.png" alt="Ocean"><span>CHAPTER I</span></div>
        <div class="d-ocean-copy"><p>For the brand's very first collection, WRM explores two materials from the Ocean: fish leather and algae film</p><a href="/wrm-world" data-link>EXPLORE WRM WORLD</a></div>
      </section>
    </div>`;
  }
  function product(id){
    const purse=id==='salmon-purse';
    const name=purse?'Salmon Purse':'Salmon Bookmark';
    document.title=`${name} — WRM`;
    const photos=purse?['purse-front','purse-grain','purse-corner','purse-design-final']:['bookmark'];
    return `<section class="d-product ${purse?'d-purse':'d-bookmark'}">
      <div class="d-product-gallery">${photos.map((src,i)=>image(src,`${name}${i?' — detail '+i:''}`,true)).join('')}${purse?'':'<img src="/img/fish-leather-hero.jpg" alt="Salmon skins prepared in strips">'}</div>
      <div class="d-product-info">
        <div class="d-product-heading"><h1>${name}</h1><span>$0.00</span></div>
        <p class="d-product-variant">Natural Crust</p>
        <p>${purse?'Your classic evening purse made with ocean-caught salmon leather. Fits your essentials. Pleated sides, lined with Korean hemp, finished with invisible magnet closure.':'A small piece of fish leather for your everyday reading.<br>Lined with horse hair classically used for suiting.'}</p>
        <p>${purse?'Please note the textures and colors of the bags vary piece to piece.':'Textures and colors of the bags vary piece to piece.'} Each skin is unique and no two pieces are identical.</p>
        <div class="d-product-detail"><p>Product Detail</p><p>Made in San Francisco</p></div>
        <p>Dimensions<br>${purse?'H: 6” × W: 7” × D: 1.5”<br>Strap Drop: 6.25”':'H: 6.5” × W: 2”'}</p>
        <p>Material and Care<br>${purse?'Exterior Body: 100% Ocean-Caught Alaskan Sockeye Salmon<br>Interior: 100% Korean Hemp fabric':'Exterior: 100% Ocean-Caught Alaskan Sockeye Salmon<br>Lining: 100% Korean Hemp fabric'}</p>
        <p>Treat like any other leather products, and see a specialist for cleaning. Avoid direct sunlight.</p>
      </div>
    </section>`;
  }
  function materials(){
    document.title='About the Materials — WRM';
    return `<section class="d-materials"><div class="d-material-grid">
      <a class="d-material-card d-material-fish" href="/about-materials/fish-leather" data-link aria-label="Fish Leather">${image('materials-fish-design-crop','',true)}<span class="d-visually-hidden">Fish Leather</span></a>
      <a class="d-material-card d-material-algae" href="/about-materials/algae" data-link aria-label="Algae — Launching 10/27">${image('materials-algae-design-crop','',true)}<span class="d-visually-hidden">Algae — Launching 10/27</span></a>
    </div></section>`;
  }
  function materialStory(fish){
    document.title=(fish?'Fish Leather':'Algae')+' — WRM';
    const recommendations=fish?[
      ['/product/salmon-purse','Shop Salmon Purse'],['/faq','FAQ'],['/about-materials/algae','About Algae'],['/wrm-world','Explore WRM World']
    ]:[
      [null,'Shop Algae Tote'],['/faq','FAQ'],['/about-materials/fish-leather','About Salmon Leather'],['/wrm-world','Explore WRM World']
    ];
    const panels=recommendations.map(([href,label],i)=>{
      const tag=href?'a':'div';
      return `<${tag} class="d-story-panel"${href?` href="${href}" data-link`:''} aria-label="${label}">${image(`${fish?'fish':'algae'}-recommend-${Math.floor(i/2)+1}-${i%2+1}-design-crop`,'',true)}<span class="d-visually-hidden">${label}</span></${tag}>`;
    }).join('');
    return `<article class="d-story ${fish?'d-story-fish':'d-story-algae'}">
      <div class="d-story-hero"><div class="d-story-photo">${image(fish?'fish-workshop':'algae-story',fish?'Preparing salmon skins for tanning':'Sheets of seaweed-derived film',true)}</div>
        <div class="d-story-title"><div class="d-ocean-art"><img src="/img/illustration-ocean.png" alt="Ocean"><span>CHAPTER I</span></div>
        <h1>${fish?'FROM INDUSTRY<br>BYPRODUCT TO<br>HAND BAGS':'ALGAE AS<br>A FUTURE<br>REPLACEMENT<br>TO PLASTIC'}</h1></div>
      </div>
      <div class="d-story-essay">${fish?`
        <p>Fish leather used to be part of many cultures around the world. While WRM focuses on the advancement of materials, it is important to highlight that much of the newness is based on old ideas. The research and development of this collection would not have been possible without those who came before us, as well as those who are choosing the path to better the material ecosystem today.</p>
        <p>The craft of turning fish skin into leather has long been practiced by coastal and riverine Indigenous communities. Today, the leading figures in restoring this craft in North America are Janey Chang and Tracy Williams from British Columbia, Canada. Below is a section from an article written about them back in 2020.</p>
        <p class="d-story-quote"><img src="/img/desktop/fish-ainu-design-crop.webp" alt="Historical fish-skin clothing">“The revival of fish skin leather is more than the rediscovery of a craft. Working with our hands in traditional ways is one of the few avenues we have to connect with our ancestors,” Chang says. In Japan, the Ainu (img. 01) crafted salmon skin into boots, which they strapped to their feet with rope. Along the Amur River in northeastern China and Siberia, Hezhen and Nivkh peoples turned the material into coats and thread. In northern Canada, the Inuit made clothing, and in Alaska, several peoples including the Alutiiq, Athabascan, and Yup'ik used fish skins to fashion boots, mittens, containers, and parkas. In the winter, Yup’ik men never left home without qayisprrluk, loose-fitting, hooded fish skin parkas that could double as shelter in an emergency … The men would prop up the hood with an ice pick and pin down the edges to make a tent-like structure. As practical and pervasive as the material was, the practice of making fish skin leather faded in the 20th century. Its loss is intertwined with colonialism and assimilation (Chloe Williams, “The Art of Turning Fish into Leather,” Hakai Magazine, April 28, 2020).</p>
        <p>Today, every tonne of filleted fish leaves behind roughly 40 kilograms of skin, waste unless someone chooses otherwise. Humans consumed an estimated 174 million tonnes of fish in 2024, according to the FAO's State of World Fisheries and Aquaculture report, which puts the skins left behind at somewhere around 7 million tonnes a year. WRM's ocean-caught Alaskan sockeye salmon is an industry byproduct, processed and tanned by 7 Leagues, a local tannery in Vancouver, Canada. Tasha, the founder of 7 Leagues, has taken on a mission to scale this craft and bring it to a wider audience and into new industries. We have worked together to achieve a natural finish. This is known as the “crust,” the material's naked state before dyeing. Grain, scale placement, and shade shift from skin to skin, and these are intentionally preserved to highlight the material's natural differences. Our tannery distinguishes itself by using no chromium during the tanning process, which is crucial, as it leads to the compostability of the material, allowing it to safely return to soil and break down when discarded.</p>`:`
        <p>The earliest seaweed-derived creation story starts in Japan with agar, a property derived specifically from red algae. According to the FAO, “The forerunner of today's commercial product was discovered quite accidentally in about 1660 when, according to legend, a Japanese innkeeper one winter night threw some surplus seaweed jelly outdoors. After several nights and days of alternately freezing and thawing, the jelly turned into a papery, translucent substance which the innkeeper found could be reboiled in water and cooled to yield a gel equal to the original. This was the beginning of a cottage industry, a winter occupation for fishing families, and the development of the manufacture and marketing of agar in the form of sheets, bars, sticks and other shapes, known in Japan as Kanten (img. 01).”</p>
        <figure class="d-story-inline d-story-kanten">${image('kanten','Kanten jelly on a plate')}<figcaption>Img. 01 Photo from Wikipedia</figcaption></figure>
        <p>Alginate, on the other hand, is a property derived from brown algae and also the main ingredient for WRM's Algae Tote. It has no folk-discovery legend; rather, it is a modern industrial chemistry story. The discovery by Stanford in the early 1880s led to renewed and vastly increased industrial use of brown seaweed. Industrial alginate extraction began in 1929 in California, then 1939 in Europe and Japan, and the 1980s in China. Since then, seaweed has been used as a binding agent and emulsifier across cosmetics, food, and fertilizers. The idea of converting it into a plastic-replacing film or fiber is a relatively recent innovation, with early experiments beginning in the early 2000s.</p>
        <p>Today, Sway's innovation applies that same raw material from brown algae (alginate) to tackle a new problem: replacing petroleum plastic products, starting with plastic packaging (img. 02). New science is proving that seaweed farming sequesters carbon at rates comparable to ecosystems like mangroves and seagrasses. Sway's materials use the principles of circular economy, uplifting the blue economy, green manufacturing, and healthy communities. Seaweed aquaculture offers climate-resilient economic opportunities in coastal communities threatened by climate change and overfishing, from Alaska to Indonesia and all around the world. Regenerative seaweed farming requires no fresh water, feed, or fertilizer, fueled simply by sun and ocean nutrients. While traditional plastics pollute for centuries, Sway materials are designed to return to the earth.</p>
        <figure class="d-story-inline d-story-sway">${image('sway','Sway poly bag sample')}<figcaption>Img. 02 Poly bag sample from Sway</figcaption></figure>`}
        ${fish?'<div class="d-story-next"><a href="/about-materials/algae" data-link>Next: Algae Material</a><a href="/faq" data-link>Please visit the FAQ page for more questions.</a></div>':''}
      </div>
      <div class="d-story-recommendations">${panels}</div>
    </article>`;
  }
  function world(){
    document.title='WRM World';
    return `<section class="d-world" aria-label="WRM World — material explorations">
      <div class="d-world-row">${image('world-clear-bag','Handmade translucent looped handbag',true)}${image('world-samples','Ocean drawing and twelve experimental crochet samples',true)}</div>
      <div class="d-world-row d-world-second">${image('world-dye','Natural dye research, thread and handwritten notes',true)}${image('world-vase-design-crop','Fish relief ceramic vase',true)}</div>
      <figure class="d-world-history">${image('world-history','Wiener Werkstätte inspiration, textile, design sketch and a woven pearl bag',true)}</figure>
      <figure class="d-world-wire">${image('world-wire','Looped black handbag, handwritten design notes, and wire sculpture',true)}</figure>
      <div class="d-world-bottom"><img src="/img/desktop/world-bottom-design-crop.webp" alt="Material studies"><a href="/about-materials" data-link aria-label="Learn More About the Materials"><span class="d-visually-hidden">Learn More About the Materials</span></a><a href="/shop" data-link aria-label="Shop Ocean Collection"><span class="d-visually-hidden">Shop Ocean Collection</span></a></div>
    </section>`;
  }
  /* Shop — built from Stella's Shop design, section for section. Every photo and
     every line of text links somewhere, except the Algae Tote (no page yet). */
  function shop(){
    document.title='Shop — WRM';
    const card=(href,img,name,sub,price,cls='')=>`<a class="d-shop-card ${cls}" href="${href}" data-link>${img}<span class="d-shop-cap"><span class="d-shop-name">${name}</span><span class="d-shop-price">${price}</span><span class="d-shop-sub">${sub}</span></span></a>`;
    return `<section class="d-shop">
      <div class="d-shop-top">
        <div class="d-shop-top-left">
          <a class="d-shop-ocean" href="/shop" data-link aria-label="Ocean"><img src="/img/illustration-ocean.png" alt="Ocean"></a>
          ${card('/product/salmon-purse',image('shop-purse-flat','Salmon purse lying on a white surface',true),'Salmon Purse','Natural Crust','$0','d-shop-purse')}
        </div>
        <a class="d-shop-big" href="/product/salmon-purse" data-link>${image('world-dyed-bag','Salmon purse in its WRM wrapping',true)}</a>
      </div>
      <div class="d-shop-mid">
        <a class="d-shop-pair" href="/product/salmon-bookmark" data-link>${image('bookmark','Salmon leather bookmark, front and lining')}</a>
        <div class="d-shop-mid-right">${card('/product/salmon-bookmark',image('shop-bookmark-book','Salmon bookmark on a small book'),'Salmon Bookmark','Natural Crust','$0','d-shop-bm')}</div>
      </div>
      <div class="d-shop-collection">
        <h2><a href="/shop" data-link>OCEAN COLLECTION 2026</a></h2>
        <div class="d-shop-grid">
          ${card('/product/salmon-purse',image('purse-front','Salmon purse'),'Salmon Purse','Natural Crust','$0')}
          ${card('/product/salmon-bookmark',image('bookmark','Salmon bookmark, front and lining'),'Salmon Bookmark','Natural Crust','$0')}
          <div class="d-shop-card d-shop-tote"><img src="/img/algae-tote.jpg" alt="Algae tote" loading="lazy"><span class="d-shop-cap"><span class="d-shop-name">Algae Tote</span><span class="d-shop-price">$0</span><span class="d-shop-sub">Natural</span></span></div>
        </div>
        <a class="d-shop-learn" href="/about-materials" data-link>LEARN MORE ABOUT THE MATERIALS</a>
      </div>
    </section>`;
  }
  function render(path){
    if(path==='/') return home();
    if(path==='/shop') return shop();
    if(path==='/product/salmon-purse') return product('salmon-purse');
    if(path==='/product/salmon-bookmark') return product('salmon-bookmark');
    if(path==='/about-materials') return materials();
    if(path==='/about-materials/fish-leather') return materialStory(true);
    if(path==='/about-materials/algae') return materialStory(false);
    if(path==='/wrm-world') return world();
    return null;
  }
  return {render};
})();
