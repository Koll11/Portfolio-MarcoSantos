// Local preview only. No dependencies or build step.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.png':'image/png', '.gif':'image/gif', '.mp4':'video/mp4', '.pdf':'application/pdf' };
http.createServer((req,res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403).end(); return; }
  fs.stat(file,(err,stat) => {
    if(err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    const headers = {'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
    let start = 0, end = stat.size - 1;
    if(range) { start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]),end) : end; }
    if(start > end || start >= stat.size) { res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end(); return; }
    if(range) headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    headers['Content-Length'] = end-start+1;
    res.writeHead(range ? 206 : 200,headers);
    if(req.method === 'HEAD') res.end(); else fs.createReadStream(file,{start,end}).pipe(res);
  });
}).listen(4173,'127.0.0.1',() => console.log('Portfolio preview: http://localhost:4173'));
