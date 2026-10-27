const { createReadStream, statSync } = require('node:fs');
const { createServer } = require('node:http');
const path = require('node:path');

const publicRoot = path.resolve(__dirname, 'public');
const srcRoot = path.resolve(__dirname, 'src');
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

function sendFile(response, filePath, headOnly = false) {
  try {
    const info = statSync(filePath);
    if (!info.isFile()) return false;
    response.writeHead(200, {
      'Content-Length': info.size,
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache',
    });
    if (headOnly) response.end();
    else createReadStream(filePath).pipe(response);
    return true;
  } catch {
    return false;
  }
}

createServer((request, response) => {
  const method = request.method || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  const isSrcRequest = pathname.startsWith('/src/');
  const root = isSrcRequest ? srcRoot : publicRoot;
  const relativePath = isSrcRequest
    ? pathname.replace(/^\/src\/?/, '')
    : (pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));

  const filePath = path.resolve(root, relativePath);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  if (sendFile(response, filePath, method === 'HEAD')) return;
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}).listen(port, '0.0.0.0', () => {
  console.log(`Garda Mangkunagaran website listening on 0.0.0.0:${port}`);
});
