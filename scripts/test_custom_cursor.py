#!/usr/bin/env python3
"""Shell cursor is scoped to landing + WRM World, including interactive descendants."""
import json, subprocess, time, urllib.request, websocket
from pathlib import Path
from PIL import Image
ROOT=Path('/root/projects/stella');ASSET=ROOT/'img/cursor-shell.png';WEB=8092;CDP=9363
assert ASSET.exists(),f'missing {ASSET}'
with Image.open(ASSET) as im:
 assert im.mode=='RGBA' and im.width<=128 and im.height<=128,'cursor must be transparent and browser-safe'
 alpha=im.getchannel('A').getextrema()
 assert alpha[0]==0 and alpha[1]==255,'cursor needs transparent and opaque pixels'
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);chrome=None
try:
 time.sleep(.8);chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/cursor-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(2)
 tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0];ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True);seq=0
 def send(method,**params):
  global seq;seq+=1;ws.send(json.dumps({'id':seq,'method':method,'params':params}))
  while True:
   r=json.loads(ws.recv())
   if r.get('id')==seq:return r.get('result',{})
 def ev(expr):return send('Runtime.evaluate',expression=expr,returnByValue=True).get('result',{}).get('value')
 send('Page.enable');send('Emulation.setDeviceMetricsOverride',width=1440,height=900,deviceScaleFactor=1,mobile=False)
 send('Page.navigate',url=f'http://localhost:{WEB}/');time.sleep(1)
 landing=json.loads(ev("JSON.stringify({cls:document.body.className,body:getComputedStyle(document.body).cursor,child:getComputedStyle(document.querySelector('button,a')).cursor})"))
 assert 'landing' in landing['cls'] and all('cursor-shell.png' in landing[k] for k in ('body','child')),landing
 ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
 for width,mobile in [(1440,False),(390,True)]:
  send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
  send('Page.navigate',url=f'http://localhost:{WEB}/wrm-world');time.sleep(1)
  world=json.loads(ev("JSON.stringify({cls:document.body.className,body:getComputedStyle(document.body).cursor,child:getComputedStyle(document.querySelector('#app a')).cursor})"))
  assert 'world-page' in world['cls'] and all('cursor-shell.png' in world[k] for k in ('body','child')),f'{width}: {world}'
 send('Page.navigate',url=f'http://localhost:{WEB}/shop');time.sleep(1)
 shop=json.loads(ev("JSON.stringify({cls:document.body.className,cursor:getComputedStyle(document.body).cursor})"))
 assert 'world-page' not in shop['cls'] and 'cursor-shell.png' not in shop['cursor'],shop
 print('PASS cursor scope')
finally:
 if chrome:chrome.kill()
 server.kill()
