"""Shared desktop footer alignment regression; accepts a local or live base URL."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8768'
OUT=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/stella-footer-alignment');OUT.mkdir(exist_ok=True)
ROUTES=['/','/product/salmon-bookmark','/product/salmon-purse','/about-materials','/about-materials/fish-leather','/about-materials/algae','/wrm-world','/shop','/shop/ocean-season','/shop/ocean-season/fish-leather','/faq','/not-found']
results=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
 try:
  page=b.new_page()
  for width in [761,1400,1512,1920]:
   page.set_viewport_size({'width':width,'height':900})
   for i,route in enumerate(ROUTES):
    page.goto(BASE+route);page.locator('.foot-mark').evaluate('(i)=>i.decode()')
    r=page.locator('.foot-mark').evaluate('i=>{const f=i.closest("footer"),a=i.getBoundingClientRect(),b=f.getBoundingClientRect(),s=getComputedStyle(i);return {visible:!!a.width,left:a.left-b.left,right:b.right-a.right,width:a.width,footerWidth:b.width,gridColumn:s.gridColumn,cssLeft:s.left,transform:s.transform}}')
    r.update(route=route,viewport=width);results.append(r)
    if width==1512 and route in ['/product/salmon-bookmark','/about-materials/algae']:
     page.locator('#foot').screenshot(path=str(OUT/f'footer-{i}.png'))
  (OUT/'measurements.json').write_text(json.dumps(results,indent=2))
 finally:b.close()
failures=[r for r in results if r['visible'] and (abs(r['left']-r['right'])>1 or min(r['left'],r['right'])<0)]
print(json.dumps({'checked':len(results),'failures':failures},indent=2))
assert not failures,'Shared footer wordmark must have equal left and right margins on every desktop route'
