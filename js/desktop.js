/* Desktop-only reference layouts. Mobile continues through the existing router. */
window.WRMDesktop = (() => {
  'use strict';
  const image = (name, alt, eager=false) => `<img src="/img/desktop/${name}.webp" alt="${alt}" ${eager?'fetchpriority="high"':'loading="lazy"'}>`;
  const caption = (title, href, cls='') => `<div class="d-caption ${cls}"><h2>${title}</h2><a href="${href}" data-link>OCEAN COLLECTION</a></div>`;
  function home(){
    document.title = 'WRM — With Raw Materials';
    return `<div class="d-home">
      <section class="d-home-hero">${image('hero','Salmon purse in fish leather',true)}
        <div class="d-caption"><h1>SALMON PURSE</h1><a href="/product/salmon-purse" data-link>OCEAN COLLECTION</a></div>
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
    const photos=purse?['purse-front','purse-strap','purse-grain','purse-corner','purse-hanging','purse-worn']:['bookmark'];
    return `<section class="d-product ${purse?'d-purse':'d-bookmark'}">
      <div class="d-product-gallery">${photos.map((src,i)=>image(src,`${name}${i?' — detail '+i:''}`,i===0)).join('')}</div>
      <div class="d-product-info">
        <div class="d-product-heading"><h1>${name}</h1><span>${purse?'$700':'$32'}</span></div>
        <p>${purse?'Your classic evening purse that fits your essentials. Slightly flirty. Made with ocean-caught fish leather that is up to 9 times stronger than a cow hide.':'A small piece of fish leather for your everyday reading. Made with leftover pieces from making the purses. Lined with horse hair classically used for suiting.'}</p>
        <p>${purse?'Please note the textures and colors of the bags vary piece to piece.':'Textures and colors of the bags vary piece to piece.'} Each skin is unique and no two pieces are identical.</p>
        <p>Made in San Francisco</p>
        <p>Dimensions<br>${purse?'H: x” x W: x” D: x”<br>Strap length:<br>Strap Drop:<br>Opening Width:':'H: 6.7” x W: 2”'}</p>
        <p>Materials<br>${purse?'Ocean-caught Alaskan Sockeye Salmon<br>Interior: Korean Hemp fabric':'Leather: Ocean-caught Alaskan Sockeye Salmon<br>Lining: Horsehair'}</p>
        <p>Care<br>Treat like any other leather products<br>Avoid direct sunlight</p>
        <button class="d-product-add" data-add="${id}">Add to cart</button>
      </div>
    </section>`;
  }
  function materials(){
    document.title='About the Materials — WRM';
    return `<section class="d-materials"><h1>About The Materials</h1><div class="d-material-grid">
      <a class="d-material-card d-material-fish" href="/about-materials/fish-leather" data-link>${image('fish-grain','Salmon leather grain',true)}<div><img src="/img/sil-fish.png" alt=""><h2>Fish Leather</h2></div></a>
      <a class="d-material-card d-material-algae" href="/about-materials/algae" data-link>${image('algae-stitch','Translucent algae material',true)}<div><img src="/img/sil-seaweed.png" alt=""><h2>Algae</h2><p>Launching 10/27</p></div></a>
    </div></section>`;
  }
  function materialStory(fish){
    document.title=(fish?'Fish Leather':'Algae')+' — WRM';
    return `<article class="d-story ${fish?'d-story-fish':'d-story-algae'}">
      <div class="d-story-hero"><div class="d-story-photo">${image(fish?'fish-workshop':'algae-story',fish?'Preparing salmon skins for tanning':'Sheets of seaweed-derived film',true)}</div>
        <div class="d-story-title"><div class="d-ocean-art"><img src="/img/illustration-ocean.png" alt="Ocean"><span>CHAPTER I</span></div>
        <h1>${fish?'FROM INDUSTRY<br>BYPRODUCTS<br>TO HAND BAGS':'ALGAE AS<br>A FUTURE<br>REPLACEMENT<br>TO PLASTIC'}</h1></div>
      </div>
      <div class="d-story-columns">${fish?`
        <div><p>Fish leather used to be part of many cultures around the world. While WRM focuses on the advancement of materials, it is important to highlight that much of the newness is based on old ideas. The research and development of this collection would not have been possible without those who came before us, as well as those who are choosing the path to better the material ecosystem today.</p>
        <p>The craft of turning fish skin into leather has long been practiced by coastal and riverine Indigenous communities. Today, the leading figures in restoring this craft in North America are Janey Chang and Tracy Williams from British Columbia, Canada. Below is a section from an article written about them back in 2020.</p>
        <p class="d-story-quote">"The revival of fish skin leather is more than the rediscovery of a craft. Working with our hands in traditional ways is one of the few avenues we have to connect with our ancestors," Chang says. In Japan, the Ainu crafted salmon skin into boots, which they strapped to their feet with rope. Along the Amur River in northeastern China and Siberia, Hezhen and Nivkh peoples turned the material into coats and thread. In northern Canada, the Inuit made clothing, and in Alaska, several peoples including the Alutiiq, Athabascan, and Yup'ik used fish skins to fashion boots, mittens, containers, and parkas. In the winter, Yup’ik men never left home without qayisprrluk, loose-fitting, hooded fish skin parkas that could double as shelter in an emergency … The men would prop up the hood with an ice pick and pin down the edges to make a tent-like structure. As practical and pervasive as the material was, the practice of making fish skin leather faded in the 20th century. Its loss is intertwined with colonialism and assimilation (Chloe Williams, "The Art of Turning Fish into Leather," Hakai Magazine, April 28, 2020).</p></div>
        <div><p>Today, every tonne of filleted fish leaves behind roughly 40 kilograms of skin, waste unless someone chooses otherwise. Humans consumed an estimated 174 million tonnes of fish in 2024, according to the FAO's State of World Fisheries and Aquaculture report, which puts the skins left behind at somewhere around 7 million tonnes a year. WRM's ocean-caught Alaskan sockeye salmon is an industry byproduct, processed and tanned by 7 Leagues, a local tannery in Vancouver, Canada. Tasha, the founder of 7 Leagues, has taken on a mission to scale this craft and bring it to a wider audience and into new industries. We have worked together to achieve a natural finish. This is known as the "crust," the material's naked state before dyeing. Grain, scale placement, and shade shift from skin to skin, and these are intentionally preserved to highlight the material's natural differences. Our tannery distinguishes itself by using no chromium during the tanning process, which is crucial, as it leads to the compostability of the material, allowing it to safely return to soil and break down when discarded.</p></div>`:`
        <div><p>The earliest seaweed-derived creation story starts in Japan with agar, a property derived specifically from red algae. According to the FAO, "The forerunner of today's commercial product was discovered quite accidentally in about 1660 when, according to legend, a Japanese innkeeper one winter night threw some surplus seaweed jelly outdoors. After several nights and days of alternately freezing and thawing, the jelly turned into a papery, translucent substance which the innkeeper found could be reboiled in water and cooled to yield a gel equal to the original. This was the beginning of a cottage industry, a winter occupation for fishing families, and the development of the manufacture and marketing of agar in the form of sheets, bars, sticks and other shapes, known in Japan as 'Kanten (img 1).'"</p>
        <div class="d-story-figures"><figure>${image('kanten','Kanten jelly on a plate')}<figcaption>Img 1. Photo from Wikipedia</figcaption></figure><figure>${image('sway','Sway the Future sample bag')}<figcaption>Img.3 Poly bag sample from Sway</figcaption></figure></div></div>
        <div><p>Alginate, on the other hand, is a property derived from brown algae and also the main ingredient for WRM's Algae Tote. It has no folk-discovery legend; rather, it is a modern industrial chemistry story. The discovery by Stanford in the early 1880s led to renewed and vastly increased industrial use of brown seaweed. Industrial alginate extraction began in 1929 in California, then 1939 in Europe and Japan, and the 1980s in China. Since then, seaweed has been used as a binding agent and emulsifier across cosmetics, food, and fertilizers. The idea of converting it into a plastic-replacing film or fiber is a relatively recent innovation, with early experiments beginning in the early 2000s.</p>
        <p class="d-story-sway">Today, Sway's innovation applies that same raw material from brown algae (alginate) to tackle a new problem: replacing petroleum plastic products. New science is proving that seaweed farming sequesters carbon at rates comparable to ecosystems like mangroves and seagrasses. Sway's materials use the principles of circular economy, uplifting the blue economy, green manufacturing, and healthy communities. Seaweed aquaculture offers climate-resilient economic opportunities in coastal communities threatened by climate change and overfishing, from Alaska to Indonesia and all around the world. Regenerative seaweed farming requires no fresh water, feed, or fertilizer fueled simply by sun and ocean nutrients. While traditional plastics pollute for centuries, Sway materials are designed to return to the earth.</p></div>`}
      </div>
    </article>`;
  }
  function world(){
    document.title='WRM World';
    return `<section class="d-world" aria-label="WRM World — material explorations">
      <div class="d-world-row">${image('world-clear-bag','Handmade translucent looped handbag',true)}${image('world-samples','Ocean drawing and twelve experimental crochet samples',true)}</div>
      <div class="d-world-row d-world-second">${image('world-dye','Natural dye research, thread and handwritten notes')}${image('world-dyed-bag','Dyed material handbag in its WRM wrapping')}</div>
      <figure class="d-world-history">${image('world-history','Wiener Werkstätte inspiration, textile, design sketch and a woven pearl bag')}</figure>
      <figure class="d-world-wire">${image('world-wire','Looped black handbag, handwritten design notes, and wire sculpture')}</figure>
      <a class="d-world-materials" href="/about-materials" data-link><div>${image('algae-sheets','Seaweed film')}${image('fish-workshop','Preparing fish skins')}${image('loom','Hand weaving')}${image('leather-stack','Stacked salmon leather')}</div><span>Explore Materials</span></a>
    </section>`;
  }
  function render(path){
    if(path==='/') return home();
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
