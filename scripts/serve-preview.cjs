const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.md':'text/plain; charset=utf-8'};
const server = http.createServer(async(req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
    const target=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
    const relative=path.relative(root,target);
    if(relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p=>p.startsWith('.')) || !types[path.extname(target)]) { res.writeHead(403); res.end(); return; }
    const bytes=await fs.readFile(target);
    res.writeHead(200,{'Content-Type':types[path.extname(target)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(Number(process.argv[2] || 0),'127.0.0.1',()=>console.log('Tracewright preview: http://127.0.0.1:'+server.address().port+'/'));
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
