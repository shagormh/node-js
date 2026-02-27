/**
 * ============================================
 * 03 - JSON API (Native HTTP)
 * ============================================
 * Topics:
 *  - Building a RESTful API without Express
 *  - CRUD operations using purely native node
 *  - CORS Headers
 * ============================================
 */

const http = require("http");

let users = [
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" }
];

const PORT = 3002;

const server = http.createServer((req, res) => {
    // 1. Enable CORS (Cross-Origin Resource Sharing)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = req.url;
    const method = req.method;

    // Set default content type
    res.setHeader("Content-Type", "application/json");

    // ──────────────────────────────────────────
    // GET /api/users (List all users)
    // ──────────────────────────────────────────
    if (url === "/api/users" && method === "GET") {
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: users.length, data: users }));
    }

    // ──────────────────────────────────────────
    // GET /api/users/:id (Single user)
    // ──────────────────────────────────────────
    else if (url.match(/\/api\/users\/([0-9]+)/) && method === "GET") {
        const id = parseInt(url.split("/")[3]);
        const user = users.find(u => u.id === id);

        if (user) {
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data: user }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ success: false, error: "User not found" }));
        }
    }

    // ──────────────────────────────────────────
    // POST /api/users (Create user)
    // ──────────────────────────────────────────
    else if (url === "/api/users" && method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", () => {
            try {
                const { name, role } = JSON.parse(body);

                if (!name) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ success: false, error: "Name is required" }));
                }

                const newUser = {
                    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
                    name,
                    role: role || "user"
                };
                users.push(newUser);

                res.writeHead(201);
                res.end(JSON.stringify({ success: true, data: newUser }));
            } catch (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: "Invalid JSON input" }));
            }
        });
    }

    // ──────────────────────────────────────────
    // DELETE /api/users/:id (Delete user)
    // ──────────────────────────────────────────
    else if (url.match(/\/api\/users\/([0-9]+)/) && method === "DELETE") {
        const id = parseInt(url.split("/")[3]);
        const initLength = users.length;
        users = users.filter(u => u.id !== id);

        if (users.length < initLength) {
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data: {} }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ success: false, error: "User not found" }));
        }
    }

    // ──────────────────────────────────────────
    // Catch All
    // ──────────────────────────────────────────
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`✅ JSON API Server running on http://localhost:${PORT}`);
    console.log("Endpoints:");
    console.log("  GET    /api/users");
    console.log("  GET    /api/users/:id");
    console.log("  POST   /api/users (requires JSON body {name, role})");
    console.log("  DELETE /api/users/:id");
});
