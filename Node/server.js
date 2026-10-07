// SIMONIX Hub - Minimaler Node.js Static Webserver (Ohne externe Dependencies)
const http = require('http');
const fs = require('fs');
const path = require('path');

// EINSTELLUNGEN:
const PORT = process.env.PORT || 3000;
// Unterordner, in dem deine HTML-, CSS- & JS-Dateien liegen (z. B. 'public' oder 'docs'):
const SUBFOLDER = 'public'; 

// MIME-Types für korrekte Auslieferung im Browser
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    let reqUrl = decodeURIComponent(req.url.split('?')[0]);
    if (reqUrl === '/') {
        reqUrl = '/index.html';
    }

    let filePath = path.join(__dirname, SUBFOLDER, reqUrl);
    const targetDir = path.join(__dirname, SUBFOLDER);

    // Schutz vor Directory Traversal
    if (!filePath.startsWith(targetDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Verboten');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            if (stats && stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>404 - Datei nicht gefunden</h1><p>Stelle sicher, dass deine Dateien im Ordner "${SUBFOLDER}" liegen.</p>`);
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Serverfehler beim Lesen der Datei');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Webserver läuft auf http://localhost:${PORT}`);
    console.log(`📁 Dateien werden aus dem Unterordner "./${SUBFOLDER}" serviert.`);
});