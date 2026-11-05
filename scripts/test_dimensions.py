#!/usr/bin/env python3
"""Dimensions drop-down: one line per measurement, 'Name: X cm | Y”', no bullets, same on desktop and mobile."""
import json, re, subprocess, sys, time, urllib.request, websocket
ROOT='/root/projects/stella'; BASE=sys.argv[1] if len(sys.argv)>1 else None; WEB=8103; CDP=9383
server=None if BASE else subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
BASE=BASE or f'http://localhost:{WEB}'
EXPECT={'salmon-purse':['Height: 6” | 15.2 cm','Width: 7” | 17.8 cm','Depth: 1.5” | 3.8 cm','Strap Drop: 5.25” | 13.3 cm'],
        'salmon-bookmark':['Height: 6.5” | 16.5 cm','Width: 2” | 5.1 cm'],
        'algae-tote':['Height: 12” | 30.5 cm','Top Width: 18” | 45.7 cm','Bottom Width: 14” | 35.6 cm','Bottom Depth: 4.75” | 12.1 cm','Strap Drop: 13” | 33 cm']}
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}','--user-data-dir=/tmp/dims-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
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
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        for handle,want in EXPECT.items():
            send('Page.navigate',url=f'{BASE}/product/{handle}'); time.sleep(1.5)
            got=json.loads(ev("""(()=>{const b=[...document.querySelectorAll('[data-product-section] [data-acc]')].find(x=>x.textContent.trim().startsWith('Dimensions'));
              b.click();const a=document.getElementById(b.getAttribute('aria-controls'));
              return JSON.stringify({lines:a.innerText.split('\\n').map(s=>s.trim()).filter(Boolean),hidden:a.hidden,bullets:a.querySelectorAll('li').length})})()"""))
            assert not got['hidden'] and got['bullets']==0, f'{width} {handle}: {got}'
            assert got['lines']==want, f'{width} {handle}: got {got["lines"]}'
            mc=json.loads(ev("""(()=>{const b=[...document.querySelectorAll('[data-product-section] [data-acc]')].find(x=>x.textContent.trim().startsWith('Material'));
              b.click();const a=document.getElementById(b.getAttribute('aria-controls'));const ls=a.innerText.split('\\n').map(s=>s.trim()).filter(Boolean);
              const links=[...a.querySelectorAll('a[href="/faq"]')];const l=links[0],cs=l&&getComputedStyle(l),info=a.querySelector('.pd-more-info');const prev=info.previousSibling;const r=document.createRange();r.setStartBefore(a.firstChild);r.setEndAfter(prev);const rs=[...r.getClientRects()];const gap=info.getBoundingClientRect().top-Math.max(...rs.map(x=>x.bottom));return JSON.stringify({last:ls[ls.length-1],faqLinks:links.length,linkText:l?.textContent,bold:+cs.fontWeight>=700,underline:cs.textDecorationLine.includes('underline'),gap:Math.round(gap),lh:parseFloat(getComputedStyle(a).fontSize)})})()"""))
            assert mc['last']=='For more information, please visit our FAQ page.' and mc['faqLinks']==1 and mc['bold'] and mc['underline'] and mc['lh']*0.6<=mc['gap']<=mc['lh']*1.6 and mc['linkText']=='FAQ', f'{width} {handle} material&care: {mc}'
            ev("[...document.querySelectorAll('[data-product-section] a[href=\"/faq\"]')].pop().click()"); time.sleep(1)
            assert ev("location.pathname")=='/faq', f'{width} {handle}: FAQ link did not navigate'
            print('PASS',width,handle,got['lines'],'| FAQ line ok')
finally:
    if chrome: chrome.kill()
    if server: server.kill()
