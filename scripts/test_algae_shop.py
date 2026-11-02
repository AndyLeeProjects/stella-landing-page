#!/usr/bin/env python3
"""Shop > Fish Leather has no Algae Tote; Shop > Algae is its own page with only the tote; menu Algae goes there, not About Materials."""
import json, subprocess, sys, time, urllib.request, websocket
ROOT='/root/projects/stella'; BASE=sys.argv[1] if len(sys.argv)>1 else None; WEB=8100; CDP=9379
server=None if BASE else subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
BASE=BASE or f'http://localhost:{WEB}'
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}','--user-data-dir=/tmp/algae-shop-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); seq=0
    def send(m,**k):
        global seq; seq+=1; ws.send(json.dumps({'id':seq,'method':m,'params':k}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==seq: return r.get('result',{})
    def ev(x): return send('Runtime.evaluate',expression=x,returnByValue=True).get('result',{}).get('value')
    send('Page.enable'); send('Network.setCacheDisabled',cacheDisabled=True)
    send('Page.navigate',url=BASE+'/'); time.sleep(1.5)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    LINKS="JSON.stringify([...new Set([...document.querySelectorAll('#app a[href^=\"/product/\"]')].map(a=>a.getAttribute('href')))])"
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        send('Page.navigate',url=BASE+'/shop/ocean-season/fish-leather'); time.sleep(1.5)
        fish=json.loads(ev(LINKS)); tote_txt=ev("document.getElementById('app').innerText.includes('Algae Tote')")
        assert '/product/algae-tote' not in fish and not tote_txt, f'{width} fish page still has tote: {fish}'
        assert '/product/salmon-purse' in fish and '/product/salmon-bookmark' in fish, f'{width} fish page lost products: {fish}'
        send('Page.navigate',url=BASE+'/shop/ocean-season/algae'); time.sleep(1.5)
        algae=json.loads(ev(LINKS))
        imgs=json.loads(ev("JSON.stringify([...document.querySelectorAll('#app img')].filter(i=>!i.src.includes('illustration-ocean')).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0})))"))
        mat=ev("!!document.querySelector('#app a[href^=\"/about-materials\"]')")
        assert algae==['/product/algae-tote'], f'{width} algae page products: {algae}'
        assert imgs and all(i['ok'] for i in imgs) and all('tote' in i['src'] for i in imgs), f'{width} algae images: {imgs}'
        assert not mat, f'{width} algae shop page links to About Materials'
        print('PASS',width,'fish:',fish,'| algae:',algae)
    # mobile menu: Shop > Algae goes to the new page (browser is still at mobile width here)
    send('Page.navigate',url=BASE+'/'); time.sleep(1.5)
    ev("document.getElementById('menuBtn').click()"); time.sleep(.5)
    href=ev("[...document.querySelectorAll('#menuList a')].find(a=>a.querySelector('.m2-menu-label')?.textContent.trim()==='Algae')?.getAttribute('href')")
    assert href=='/shop/ocean-season/algae', f'menu Algae href: {href}'
    print('PASS mobile menu Algae ->',href)
finally:
    if chrome: chrome.kill()
    if server: server.kill()
