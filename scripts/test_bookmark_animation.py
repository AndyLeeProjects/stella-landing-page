#!/usr/bin/env python3
"""Bookmark animation is a lightweight looping video and final gallery item on desktop/mobile."""
import json, subprocess, time, urllib.request, websocket
from pathlib import Path
ROOT=Path('/root/projects/stella'); MEDIA=ROOT/'img/bookmark-texture.mp4'; WEB=8089; CDP=9352
assert MEDIA.exists(), f'missing {MEDIA}'
assert MEDIA.stat().st_size < 5_000_000, 'bookmark animation is too large for a product gallery'
server=subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}',f'--user-data-dir=/tmp/bookmark-gif-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); seq=0
    def send(method,**params):
        global seq
        seq+=1; ws.send(json.dumps({'id':seq,'method':method,'params':params}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==seq:return r.get('result',{})
    def ev(expr):return send('Runtime.evaluate',expression=expr,returnByValue=True).get('result',{}).get('value')
    send('Page.enable');send('Page.navigate',url=f'http://localhost:{WEB}/');time.sleep(1)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    for width,mobile,count in [(1440,False,4),(390,True,3)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        send('Page.navigate',url=f'http://localhost:{WEB}/product/salmon-bookmark');time.sleep(1)
        ev("document.querySelector('video[src=\"/img/bookmark-texture.mp4\"]').scrollIntoView({block:'center',inline:'center'})");time.sleep(1)
        data=json.loads(ev("(()=>{const g=document.querySelector('.d2p-gallery,.m2p-gallery'),items=[...g.querySelectorAll('img,video')],last=items.at(-1),page=document.querySelector('.d2-product');return JSON.stringify({count:items.length,tag:last?.tagName,src:last?.getAttribute('src'),autoplay:last?.autoplay,muted:last?.muted,loop:last?.loop,playsInline:last?.playsInline,paused:last?.paused,currentTime:last?.currentTime,contained:!page||last.getBoundingClientRect().bottom<=page.getBoundingClientRect().bottom+1})})()"))
        assert data['count']==count and data['tag']=='VIDEO' and data['src']=='/img/bookmark-texture.mp4', f'{width}px: {data}'
        assert data['autoplay'] and data['muted'] and data['loop'] and data['playsInline'] and not data['paused'] and data['currentTime']>0 and data['contained'], f'{width}px behavior: {data}'
        print('PASS',width,data)
finally:
    if chrome:chrome.kill()
    server.kill()
