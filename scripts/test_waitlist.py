#!/usr/bin/env python3
"""Sold-out products show a white 'Join the waitlist' box; submitting posts {email, source:'waitlist', product}.
Stock and the Google Sheet are faked inside the browser: no Shopify or sheet changes."""
import json, subprocess, sys, time, urllib.request, websocket
ROOT='/root/projects/stella'; BASE=sys.argv[1] if len(sys.argv)>1 else None; WEB=8095; CDP=9373
server=None if BASE else subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
BASE=BASE or f'http://localhost:{WEB}'
FAKE="""(()=>{const real=window.fetch;window.__wl=[];window.fetch=async(u,o={})=>{u=String(u);
 if(u.includes('script.google.com')){window.__wl.push(JSON.parse(o.body));return new Response('',{status:200});}
 if(u.includes('/api/product?')){const h=new URL(u,location.href).searchParams.get('handle'),ok=sessionStorage.getItem('soldOut')!=='1';
  const v={id:'gid://shopify/ProductVariant/1',title:'Default Title',availableForSale:ok,selectedOptions:[{name:'Title',value:'Default Title'}],price:{amount:'10.0',currencyCode:'USD'}};
  return new Response(JSON.stringify({product:{handle:h,title:h,availableForSale:ok,images:{nodes:[]},variants:{nodes:[v]}}}),{status:200,headers:{'Content-Type':'application/json'}});}
 if(u.includes('/api/cart'))return new Response(JSON.stringify({cart:null}),{status:200,headers:{'Content-Type':'application/json'}});
 return real(u,o);};})();"""
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}','--user-data-dir=/tmp/waitlist-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    time.sleep(2)
    tab=[x for x in json.load(urllib.request.urlopen(f'http://localhost:{CDP}/json')) if x['type']=='page'][0]
    ws=websocket.create_connection(tab['webSocketDebuggerUrl'],suppress_origin=True); seq=0
    def send(m,**k):
        global seq; seq+=1; ws.send(json.dumps({'id':seq,'method':m,'params':k}))
        while True:
            r=json.loads(ws.recv())
            if r.get('id')==seq: return r.get('result',{})
    def ev(x): return send('Runtime.evaluate',expression=x,returnByValue=True,awaitPromise=True).get('result',{}).get('value')
    send('Page.enable'); send('Network.setCacheDisabled',cacheDisabled=True)
    send('Page.addScriptToEvaluateOnNewDocument',source=FAKE)
    send('Page.navigate',url=BASE+'/'); time.sleep(1.5)
    ev("localStorage.setItem('wrm-admin-unlocked','2504d0ac9df6c61a24511608889e47c745e57a249078e6269bf1284f89c3867f')")
    names={'salmon-purse':'Salmon Bag','salmon-bookmark':'Bookmark','algae-tote':'Algae Tote'}
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        for handle,name in names.items():
            # in stock: unchanged black Add to cart
            ev("sessionStorage.removeItem('soldOut')"); send('Page.navigate',url=f'{BASE}/product/{handle}'); time.sleep(2.5)
            s=json.loads(ev("(()=>{const b=document.querySelector('[data-add]'),c=getComputedStyle(b);return JSON.stringify({t:b.textContent.trim(),bg:c.backgroundColor,dis:b.disabled})})()"))
            assert s=={'t':'Add to cart','bg':'rgb(0, 0, 0)','dis':False}, f'{width} {handle} in-stock: {s}'
            # sold out: white Join the waitlist
            ev("sessionStorage.setItem('soldOut','1')"); send('Page.navigate',url=f'{BASE}/product/{handle}'); time.sleep(2.5)
            s=json.loads(ev("(()=>{const b=document.querySelector('[data-add]'),c=getComputedStyle(b);return JSON.stringify({t:b.textContent.trim(),bg:c.backgroundColor,fg:c.color,border:c.borderTopColor,dis:b.disabled,w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})})()"))
            assert s['t']=='Join the waitlist' and s['bg']=='rgb(255, 255, 255)' and s['fg']=='rgb(0, 0, 0)' and s['border']=='rgb(0, 0, 0)' and not s['dis'], f'{width} {handle} sold-out: {s}'
            ev("document.querySelector('[data-add]').click()"); time.sleep(.3)
            ev("(()=>{const i=document.querySelector('.waitlist-form input');i.value='test@example.com';document.querySelector('.waitlist-form button').click()})()"); time.sleep(.8)
            done=ev("document.querySelector('.waitlist-done')?.textContent")
            sent=json.loads(ev("JSON.stringify(window.__wl)"))
            assert done=='You’re on the list. We’ll email you when it’s restocked.', f'{width} {handle} message: {done!r}'
            assert sent==[{'email':'test@example.com','source':'waitlist','product':name}], f'{width} {handle} payload: {sent}'
            print('PASS',width,handle,'->',name)
finally:
    if chrome: chrome.kill()
    if server: server.kill()
