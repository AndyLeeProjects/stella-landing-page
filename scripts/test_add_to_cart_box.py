#!/usr/bin/env python3
"""All product Add to Cart controls use the full-width black-box treatment."""
import json, subprocess, time, urllib.request, websocket
ROOT='/root/projects/stella'; WEB=8090; CDP=9355
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/add-box-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); seq=0
    def send(method,**params):
        global seq
        seq+=1;ws.send(json.dumps({'id':seq,'method':method,'params':params}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==seq:return r.get('result',{})
    def ev(expr):return send('Runtime.evaluate',expression=expr,returnByValue=True).get('result',{}).get('value')
    send('Page.enable');send('Page.navigate',url=f'http://localhost:{WEB}/');time.sleep(1)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        for product in ['salmon-purse','salmon-bookmark','algae-tote']:
            send('Page.navigate',url=f'http://localhost:{WEB}/product/{product}');time.sleep(.8)
            d=json.loads(ev("(()=>{const b=document.querySelector('[data-add]'),c=getComputedStyle(b),p=b.parentElement.getBoundingClientRect(),r=b.getBoundingClientRect();return JSON.stringify({bg:c.backgroundColor,color:c.color,opacity:c.opacity,decoration:c.textDecorationLine,width:r.width,parent:p.width,height:r.height})})()"))
            assert d['bg']=='rgb(0, 0, 0)' and d['color']=='rgb(255, 255, 255)', f'{width}px {product}: colors {d}'
            assert d['opacity']=='1' and d['decoration']=='none' and d['width']>=d['parent']*.95 and d['height']>=35, f'{width}px {product}: box {d}'
            print('PASS',width,product,d)
finally:
    if chrome:chrome.kill()
    server.kill()
