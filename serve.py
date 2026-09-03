#!/usr/bin/env python3
"""Dev server with SPA fallback: unknown paths serve index.html."""
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def do_GET(self):
        p = self.path.split('?')[0]
        if not os.path.exists(os.path.join(ROOT, p.lstrip('/'))) or p == '/':
            if not os.path.splitext(p)[1]: self.path = '/index.html'
        return super().do_GET()
    def log_message(self, *a): pass

ThreadingHTTPServer(('', PORT), H).serve_forever()
