import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  let filePath = path.join(dir, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath)) filePath = path.join(dir, 'index.html');
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`NGO Hub running at http://127.0.0.1:${PORT}`);
});
