#!/usr/bin/env python3
"""FAQ: Shipping / Fish Leather / Algae sections, each a header followed by one closed drop-down per question.
Materials pages keep no drop-downs."""
import json, subprocess, sys, time, urllib.request, websocket
ROOT='/root/projects/stella'; BASE=sys.argv[1] if len(sys.argv)>1 else None; WEB=8097; CDP=9375
server=None if BASE else subprocess.Popen(['python3','serve.py',str(WEB)],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
BASE=BASE or f'http://localhost:{WEB}'
chrome=None
try:
    time.sleep(.8)
    chrome=subprocess.Popen(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--remote-debugging-port={CDP}','--user-data-dir=/tmp/faq-sections-test','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
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
    expected={'Shipping':1,'Fish Leather':19,'Algae':7}
    for width,mobile in [(1440,False),(390,True)]:
        send('Emulation.setDeviceMetricsOverride',width=width,height=900,deviceScaleFactor=1,mobile=mobile)
        send('Page.navigate',url=BASE+'/faq'); time.sleep(1.5)
        d=json.loads(ev("""JSON.stringify([...document.querySelectorAll('[data-faq-section]')].map(s=>{const h=s.querySelector('h2'),q=[...s.querySelectorAll('[data-acc]')];
          return {title:h.textContent.trim(),hSize:parseFloat(getComputedStyle(h).fontSize),qSize:parseFloat(getComputedStyle(q[0]).fontSize),
            n:q.length,allClosed:q.every(b=>b.getAttribute('aria-expanded')==='false'&&document.getElementById(b.getAttribute('aria-controls')).hidden),
            first:q[0].querySelector('span').textContent.trim()}}))"""))
        got={x['title']:x['n'] for x in d}
        assert [x['title'] for x in d]==list(expected) and got==expected, f'{width}: sections {got}'
        for x in d:
            assert x['allClosed'], f'{width} {x["title"]}: not all closed'
            assert x['hSize']>x['qSize']*1.3, f'{width} {x["title"]}: header not large ({x["hSize"]} vs {x["qSize"]})'
            assert '—' not in x['first'] and (x['title']=='Shipping' or x['first'].endswith('?')), f'{width} {x["title"]}: row is not a question: {x["first"]!r}'
        o=json.loads(ev("(()=>{const b=document.querySelectorAll('[data-faq-section]')[1].querySelector('[data-acc]');b.click();const a=document.getElementById(b.getAttribute('aria-controls'));return JSON.stringify({exp:b.getAttribute('aria-expanded'),hidden:a.hidden,text:a.textContent.trim().slice(0,40)})})()"))
        assert o['exp']=='true' and not o['hidden'] and o['text'], f'{width}: click did not open: {o}'
        ok=json.loads(ev("(()=>{const r=[...document.querySelectorAll('[data-acc]')].map(b=>b.getBoundingClientRect());return JSON.stringify(r.every(x=>x.right<=innerWidth+1))})()"))
        assert ok, f'{width}: a row overflows the screen'
        if not mobile:
            ev("document.querySelectorAll('[data-acc]').forEach(b=>{if(b.getAttribute('aria-expanded')==='false')b.click()})"); time.sleep(.3)
            lay=json.loads(ev("""(()=>{const s=[...document.querySelectorAll('[data-faq-section]')].map(e=>e.getBoundingClientRect());
              const gaps=[...document.querySelectorAll('.d2-faq [data-acc]')].map(b=>b.querySelector('.d2-chev').getBoundingClientRect().left-b.querySelector('span').getBoundingClientRect().right);
              return JSON.stringify({dash:document.getElementById('app').innerText.includes('—'),fish:[s[1].left,s[1].top,s[1].right],algae:[s[2].left,s[2].top],maxGap:Math.max(...gaps),rowW:document.querySelector('.d2-faq [data-acc]').getBoundingClientRect().width})})()"""))
            assert not lay['dash'], f'{width}: em-dash still on desktop FAQ'
            assert lay['algae'][0]>lay['fish'][2] and abs(lay['algae'][1]-lay['fish'][1])<2, f'{width}: not side by side {lay}'
            assert lay['rowW']<=500, f'{width}: rows still wide ({lay["rowW"]}px)'
            assert lay['maxGap']<=20, f'{width}: arrow too far from question ({lay["maxGap"]:.0f}px)'
            print('  desktop layout', lay)
        else:
            mob=json.loads(ev("JSON.stringify({cols:!!document.querySelector('.d2-faq-cols'),w:document.querySelector('.m2f .m2-acc-q').getBoundingClientRect().width})"))
            assert not mob['cols'], f'{width}: columns leaked to mobile'
        for path in ['/about-materials/fish-leather','/about-materials/algae']:
            send('Page.navigate',url=BASE+path); time.sleep(1.2)
            assert ev("document.querySelectorAll('#app [data-acc]').length")==0, f'{width} {path}: drop-downs back on materials page'
        print('PASS',width,got,'| opened:',o['text'])
finally:
    if chrome: chrome.kill()
    if server: server.kill()
