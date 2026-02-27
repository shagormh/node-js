/**
 * ============================================
 * 04 - Serving Static Files (Native HTTP)
 * ============================================
 * Topics:
 *  - Reading files via fs
 *  - Mapping file extensions to MIME types
 *  - Serving HTML, CSS, JS, and Images natively
 * ============================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3003;

// Create a public folder for demo purposes if it doesn't exist
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);

    // Create an index.html
    fs.writeFileSync(path.join(publicDir, "index.html"), `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Static File Server</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Static Native Server 🚀</h1>
      <p>This HTML is served from the /public folder.</p>
      <script src="app.js"></script>
    </body>
    </html>
  `);

    // Create a style.css
    fs.writeFileSync(path.join(publicDir, "style.css"), `
    body { font-family: sans-serif; text-align: center; margin-top: 50px; background: #fdfdfd; }
    h1 { color: #007acc; }
  `);

    // Create an app.js
    fs.writeFileSync(path.join(publicDir, "app.js"), `
    console.log("Client-side script loaded successfully!");
  `);
}

// ──────────────────────────────────────────
// MIME Type Dictionary
// ──────────────────────────────────────────
const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json",
    ".txt": "text/plain"
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "GET") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        return res.end("Method Not Allowed");
    }

    // Determine requested file path
    let filePath = req.url === "/" ? "/index.html" : req.url;
    filePath = path.join(publicDir, filePath);

    // Prevent directory traversal attacks (e.g. going up via ../)
    if (!filePath.startsWith(publicDir)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        return res.end("Forbidden");
    }

    // Determine Content-Type based on extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || "application/octet-stream";

    // Read and serve file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === "ENOENT") {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("404 Not Found");
            } else {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8"); // 'content' is a Buffer
        }
    });
});

server.listen(PORT, () => {
    console.log(`✅ Static File Server running on http://localhost:${PORT}`);
    console.log(`Serving files from: ${publicDir}`);
});
