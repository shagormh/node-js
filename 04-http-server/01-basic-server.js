/**
 * ============================================
 * 01 - Basic HTTP Server
 * ============================================
 * Topics:
 *  - http.createServer
 *  - request (req) and response (res) objects
 *  - Setting status codes & headers
 *  - Sending plain text and HTML
 * ============================================
 */

const http = require("http");

console.log("=== Basic HTTP Server ===\n");

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Log every request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Basic routing logic
    if (req.url === "/") {
        // 1. Send Plain Text
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("Welcome to the Node.js HTTP Server!\n");
        res.end("This is the home page.");
    }
    else if (req.url === "/html") {
        // 2. Send HTML
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(`
      <html>
        <head><title>Node HTML</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #4CAF50;">Hello from Node.js! 🚀</h1>
          <p>This HTML was sent directly from the server.</p>
          <a href="/">Go Back</a>
        </body>
      </html>
    `);
    }
    else if (req.url === "/info") {
        // 3. Inspecting the Request object
        const info = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            httpVersion: req.httpVersion
        };

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(info, null, 2));
    }
    else {
        // 4. Handle 404 Not Found
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 - Page Not Found!");
    }
});

// Start listening
server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`Try visiting:`);
    console.log(`  - http://localhost:${PORT}/`);
    console.log(`  - http://localhost:${PORT}/html`);
    console.log(`  - http://localhost:${PORT}/info`);
    console.log(`  - http://localhost:${PORT}/404-test`);
    console.log(`\nPress Ctrl+C to stop the server.`);
});

// Handle server errors (e.g., port already in use)
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
    } else {
        console.error(`❌ Server Error: ${err.message}`);
    }
});
