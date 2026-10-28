#!/usr/bin/env python3
"""Product body copy, accordions, links, and CTA share one type family and size."""
import json, subprocess, time, urllib.request, websocket
ROOT='/root/projects/stella';WEB=8091;CDP=9356
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);chrome=None
try:
 time.sleep(.8);chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/product-type-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(2)
 tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0];ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True);seq=0
 def send(method,**params):
  global seq;seq+=1;ws.send(json.dumps({'id':seq,'method':method,'params':params}))
  while True:
   r=json.loads(ws.recv())
   if r.get('id')==seq:return r.get('result',{})
 def ev(expr):return send('Runtime.evaluate',expression=expr,returnByValue=True).get('result',{}).get('value')
 send('Page.enable');send('Page.navigate',url=f'http://localhost:{WEB}/');time.sleep(1);ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
 for width,mobile in [(1440,False),(390,True)]:
  send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
  for product in ['salmon-purse','salmon-bookmark','algae-tote']:
   send('Page.navigate',url=f'http://localhost:{WEB}/product/{product}');time.sleep(.8)
   d=json.loads(ev("(()=>{const sels=['.d2p-copy>p:first-child,.m2p-variant','.d2p-acc-q,.m2p-acc-q','.d2p-acc-a,.m2p-acc-a','[data-add]','.d2p-more'];return JSON.stringify(sels.map(s=>document.querySelector(s)).filter(Boolean).map(e=>{const c=getComputedStyle(e);return {cls:e.className,family:c.fontFamily,size:c.fontSize}}))})()"))
   base=(d[0]['family'],d[0]['size']);assert all((x['family'],x['size'])==base for x in d),f'{width}px {product}: {d}'
   print('PASS',width,product,base)
finally:
 if chrome:chrome.kill()
 server.kill()
