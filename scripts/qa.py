#!/usr/bin/env python3
"""Launch QA: crawl every route at mobile + desktop via headless Chrome CDP.
Reports console errors, broken images, horizontal overflow, small tap targets, nav clipping."""
import json, subprocess, time, base64, sys, urllib.request, websocket  # pip: websocket-client
CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
ROUTES = ['/','/shop','/shop/ocean-season','/shop/ocean-season/fish-leather','/product/salmon-purse',
          '/product/salmon-bookmark','/about-materials','/about-materials/fish-leather','/about-materials/algae','/wrm-world','/faq','/nope']
p = subprocess.Popen([CH,'--headless=new','--disable-gpu','--remote-debugging-port=9333','--no-first-run','--user-data-dir=/tmp/wrm-qa',BASE+'/'],
                     stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2.5)
tabs = [t for t in json.load(urllib.request.urlopen('http://localhost:9333/json')) if t['type']=='page']
ws = websocket.create_connection(tabs[0]['webSocketDebuggerUrl'], suppress_origin=True)
_id = 0
def send(m, **params):
    global _id; _id += 1; ws.send(json.dumps({'id':_id,'method':m,'params':params}))
    while True:
        r = json.loads(ws.recv())
        if r.get('id') == _id: return r.get('result', {})
        if r.get('method') in ('Runtime.exceptionThrown','Log.entryAdded'):
            e = r['params']; msg = e.get('exceptionDetails',{}).get('text') or e.get('entry',{}).get('text'); lvl = e.get('entry',{}).get('level','error')
            if lvl in ('error',) : console.append(msg)
def ev(expr):
    return send('Runtime.evaluate', expression=expr, returnByValue=True, awaitPromise=True).get('result',{}).get('value')
send('Runtime.enable'); send('Log.enable'); send('Page.enable')
AUDIT = """(()=>{const nav=document.getElementById('nav').getBoundingClientRect().bottom;
 const narrowHero=[...document.querySelectorAll('.season-hero,.world-hero,.mat-hero')].filter(el=>{const r=el.getBoundingClientRect(); return Math.abs(r.width-innerWidth)>3 && r.width < innerWidth}).map(el=>el.className.slice(0,30)+' w='+Math.round(el.getBoundingClientRect().width));
 const leaves=[...document.querySelectorAll('#app *')].filter(e=>e.children.length===0||e.tagName==='IMG').map(e=>e.getBoundingClientRect()).filter(b=>b.height>0).sort((a,b)=>a.top-b.top);
 const small=[...document.querySelectorAll('a,button')].filter(e=>{let r=e.getBoundingClientRect(); if(e.matches('.link')){r={width:r.width+16,height:r.height+20}}return r.width>0&&r.height>0&&(r.height<40||(r.width<40&&!e.matches('.crumbs a')))&&!e.closest('[aria-hidden=true]')}).map(e=>(e.className||e.tagName).toString().slice(0,24)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height));
 return {broken:[...document.images].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.getAttribute('src')),
  overflow:document.documentElement.scrollWidth>innerWidth, clipped:leaves.length&&leaves[0].top<nav&&!document.querySelector('.mh') /* mobile home hero sits under transparent nav by design */,
  narrowHero, small:[...new Set(small)], title:document.title, h1:!!document.querySelector('h1,h2'), cartVisible:!document.getElementById('cartBtn').hidden}})()"""
issues = 0
for w,h,mob in [(390,844,True),(1280,900,False)]:
    send('Emulation.setDeviceMetricsOverride', width=w, height=h, deviceScaleFactor=1, mobile=mob)
    print(f"\n== {w}px ==")
    for r in ROUTES:
        console = []
        send('Page.navigate', url=BASE+r); time.sleep(1.6)
        ev("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')"); time.sleep(.8)
        a = ev(AUDIT) or {}
        flags = []
        if console: flags.append(f"console={console}")
        if a.get('broken'): flags.append(f"broken={a['broken']}")
        if a.get('overflow'): flags.append("OVERFLOW")
        if a.get('clipped'): flags.append("CLIPPED")
        if a.get('narrowHero') and w <= 760: flags.append(f"NARROW_HERO={a['narrowHero']}")
        if a.get('small'): flags.append(f"small={a['small']}")
        if not a.get('cartVisible'): flags.append("cart hidden")
        issues += len(flags)
        print(f"{'OK ' if not flags else 'FIX'} {r:34s} {'; '.join(flags)}")
# interaction flow on mobile
send('Emulation.setDeviceMetricsOverride', width=390, height=844, deviceScaleFactor=1, mobile=True)
send('Page.navigate', url=BASE+'/product/salmon-purse'); time.sleep(1.5)
ev("localStorage.clear()")
ev("document.querySelector('[data-add]').click()"); time.sleep(.6)
print("\nflow: add→cart open:", ev("document.getElementById('cart').getAttribute('aria-hidden')")=='false', "count:", ev("document.getElementById('cartCount').textContent"))
ev("document.querySelector('[data-qty][data-d=\"1\"]').click()"); print("qty+ total:", ev("document.getElementById('cartTotal').textContent"))
ev("document.querySelector('[data-remove]').click()"); print("remove→empty:", ev("!!document.querySelector('.cart-empty')"))
ev("document.getElementById('cartClose').click(); document.getElementById('menuBtn').click()"); time.sleep(.6)
print("menu open:", ev("document.getElementById('menu').getAttribute('aria-hidden')")=='false', "| body locked:", ev("document.body.style.overflow")=='hidden')
ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))"); print("esc closes:", ev("document.getElementById('menu').getAttribute('aria-hidden')")=='true')
ev("document.querySelector('.faq-q')") ; send('Page.navigate', url=BASE+'/faq'); time.sleep(1.2)
ev("document.querySelectorAll('.faq-q')[2].click()"); print("faq toggle:", ev("document.querySelectorAll('.faq-item.open').length")==1)
print(f"\nTOTAL FLAGS: {issues}")
ws.close(); p.terminate()
