#!/usr/bin/env python3
"""Regression: all three product pages expose three closed, clickable detail accordions on desktop and mobile."""
import json, subprocess, time, urllib.request, websocket
ROOT='/root/projects/stella'; WEB=8087; CDP=9346
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/product-acc-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); i=0
    def send(method,**params):
        global i
        i+=1; ws.send(json.dumps({'id':i,'method':method,'params':params}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==i:return r.get('result',{})
    def ev(expr): return send('Runtime.evaluate',expression=expr,returnByValue=True,awaitPromise=True).get('result',{}).get('value')
    send('Page.enable')
    send('Page.navigate',url=f'http://localhost:{WEB}/'); time.sleep(1)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    expected=['Product Detail','Dimensions','Material & Care']
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        for product in ['salmon-purse','salmon-bookmark','algae-tote']:
            send('Page.navigate',url=f'http://localhost:{WEB}/product/{product}'); time.sleep(.8)
            state=ev("JSON.stringify([...document.querySelectorAll('[data-product-section]')].map(x=>({label:x.querySelector('button span').innerText.trim(),expanded:x.querySelector('button').getAttribute('aria-expanded'),hidden:x.querySelector('[data-product-content]').hidden})))")
            rows=json.loads(state or '[]')
            assert [r['label'] for r in rows]==expected, f'{width}px {product}: rows={rows}'
            assert all(r['expanded']=='false' and r['hidden'] for r in rows), f'{width}px {product}: not initially collapsed: {rows}'
            opened=json.loads(ev("(()=>{const b=document.querySelector('[data-product-section] button');b.click();const a=b.nextElementSibling;return JSON.stringify({expanded:b.getAttribute('aria-expanded'),hidden:a.hidden,text:a.innerText.trim()})})()"))
            assert opened['expanded']=='true' and not opened['hidden'] and opened['text'], f'{width}px {product}: click did not open: {opened}'
            print('PASS',width,product)
finally:
    if chrome: chrome.kill()
    server.kill()
