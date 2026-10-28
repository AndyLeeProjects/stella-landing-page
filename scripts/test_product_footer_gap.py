#!/usr/bin/env python3
"""Product pages keep breathing room between Add to cart and the footer."""
import json, subprocess, time, urllib.request, websocket
ROOT='/root/projects/stella'; WEB=8088; CDP=9349
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/product-gap-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); seq=0
    def send(method,**params):
        global seq
        seq+=1; ws.send(json.dumps({'id':seq,'method':method,'params':params}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==seq:return r.get('result',{})
    def ev(expr): return send('Runtime.evaluate',expression=expr,returnByValue=True,awaitPromise=True).get('result',{}).get('value')
    send('Page.enable'); send('Page.navigate',url=f'http://localhost:{WEB}/'); time.sleep(1)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    for width,mobile,min_gap in [(1440,False,60),(390,True,40)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        for product in ['salmon-purse','salmon-bookmark','algae-tote']:
            send('Page.navigate',url=f'http://localhost:{WEB}/product/{product}'); time.sleep(.8)
            ev("scrollTo(0,document.documentElement.scrollHeight)"); time.sleep(.2)
            data=json.loads(ev("(()=>{const b=document.querySelector('[data-add]').getBoundingClientRect(),f=document.getElementById('foot').getBoundingClientRect();return JSON.stringify({gap:f.top-b.bottom,buttonBottom:b.bottom,footerTop:f.top,scrollY})})()"))
            assert data['gap']>=min_gap, f'{width}px {product}: gap {data["gap"]:.1f}px < {min_gap}px ({data})'
            print('PASS',width,product,round(data['gap'],1))
finally:
    if chrome: chrome.kill()
    server.kill()
