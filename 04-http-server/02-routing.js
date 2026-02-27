/**
 * ============================================
 * 02 - Advanced Routing (Native HTTP)
 * ============================================
 * Topics:
 *  - URL parsing (new URL())
 *  - Query strings
 *  - Method branching (GET vs POST)
 *  - Reading POST body data
 * ============================================
 */

const http = require("http");

const PORT = 3001;

const server = http.createServer((req, res) => {
    // Parse URL & Query Strings safely
    // Note: req.url doesn't contain the protocol/host, so we provide a dummy base
    const baseURL = `http://${req.headers.host}`;
    const parsedUrl = new URL(req.url, baseURL);

    const pathname = parsedUrl.pathname;
    const method = req.method;

    console.log(`${method} ${pathname}`);

    // ──────────────────────────────────────────
    // GET Routes
    // ──────────────────────────────────────────
    if (method === "GET") {
        if (pathname === "/") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
        <h2>Native Routing Demo</h2>
        <ul>
          <li><a href="/search?q=nodejs&sort=asc">Test Query String</a></li>
          <li>
            <form action="/submit" method="POST">
              <input type="text" name="username" placeholder="Enter name" required />
              <button type="submit">POST Data</button>
            </form>
          </li>
        </ul>
      `);
        }
        // Handle Query Strings
        else if (pathname === "/search") {
            const queryParams = Object.fromEntries(parsedUrl.searchParams);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                message: "Search parameters received",
                query: queryParams
            }, null, 2));
        }
        else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }

    // ──────────────────────────────────────────
    // POST Routes (Reading Body Data)
    // ──────────────────────────────────────────
    else if (method === "POST") {
        if (pathname === "/submit") {

            // The body arrives in chunks (streams)
            let body = "";

            req.on("data", (chunk) => {
                body += chunk.toString();
                // Prevent extremely large payloads (flood attack)
                if (body.length > 1e6) req.connection.destroy();
            });

            req.on("end", () => {
                // Here body is typically a URL-encoded string if sent from an HTML form:
                // e.g., "username=Shagor"

                // Let's parse it using URLSearchParams
                const params = new URLSearchParams(body);
                const username = params.get("username") || "Unknown";

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(`
          <h2>Form Submitted Successfully!</h2>
          <p>Welcome, <strong>${username}</strong></p>
          <a href="/">Go Back</a>
        `);
            });
        }

        // Example handling JSON POST
        else if (pathname === "/api/data") {
            let body = "";
            req.on("data", chunk => body += chunk.toString());

            req.on("end", () => {
                try {
                    const data = JSON.parse(body);
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, receivedData: data }));
                } catch (err) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid JSON payload" }));
                }
            });
        }

        else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }

    // Handle other methods
    else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end(`${method} Method Not Allowed`);
    }
});

server.listen(PORT, () => {
    console.log(`✅ Routing Server running on http://localhost:${PORT}`);
});
