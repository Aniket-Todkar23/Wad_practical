const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3003; // Using port 3003

const server = http.createServer((req, res) => {
    // Serve the HTML Frontend page
    if (req.url === '/' && req.method === 'GET') {
        const indexPath = path.join(__dirname, 'index.html');
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error while loading index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // Serve the Product Data JSON API
    else if (req.url === '/api/products' && req.method === 'GET') {
        const jsonPath = path.join(__dirname, 'products.json');
        fs.readFile(jsonPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error while reading products.json');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(data);
            }
        });
    } 
    // Handle 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api/products`);
});