/**
 * ============================================
 * 01 - Basic Express Server
 * ============================================
 * Topics:
 *  - Initializing Express
 *  - Basic Routing (GET, POST, PUT, DELETE)
 *  - Express Request (req) and Response (res)
 *  - Route Parameters & Query Strings
 * ============================================
 * Note: Requires `npm install express`
 */

const express = require("express");
const app = express();
const PORT = 4000;

// ──────────────────────────────────────────
// 1. Built-in Middleware for Body Parsing
// ──────────────────────────────────────────
// Parses incoming requests with JSON payloads (replaces bodyParser logic)
app.use(express.json());

// Parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));


// ──────────────────────────────────────────
// 2. Basic Routes
// ──────────────────────────────────────────
console.log("=== Basic Express Server ===\n");

// Home Route (GET)
app.get("/", (req, res) => {
    res.send("<h1>Hello from Express! 🚀</h1>");
});

// JSON API Route (Express automatically serializes JS objects to JSON)
app.get("/api/info", (req, res) => {
    res.json({
        framework: "Express.js",
        version: "4.x",
        message: "Building APIs is much easier now!"
    });
});


// ──────────────────────────────────────────
// 3. Route Parameters & Query Strings
// ──────────────────────────────────────────

// Using route parameters (e.g. /api/users/42)
app.get("/api/users/:userId", (req, res) => {
    const { userId } = req.params; // params maps to the :userId
    res.json({ success: true, requestedUserId: userId });
});

// Using query parameters (e.g. /api/search?q=nodejs&sort=asc)
app.get("/api/search", (req, res) => {
    const { q, sort } = req.query; // query parses the '?q=...' part automatically

    if (!q) {
        return res.status(400).json({ error: "Search query 'q' is required" });
    }

    res.json({
        resultsFor: q,
        sortBy: sort || "desc"
    });
});


// ──────────────────────────────────────────
// 4. Handling other HTTP Methods
// ──────────────────────────────────────────

// POST - Usually for creating data
app.post("/api/users", (req, res) => {
    // Access data from body (requires express.json() middleware)
    const userData = req.body;

    if (!userData.name) {
        return res.status(400).json({ error: "Name is required" });
    }

    // 201 Created status
    res.status(201).json({
        message: "User created successfully",
        data: { id: 101, ...userData }
    });
});

// PUT / PATCH - For updating data
app.put("/api/users/:userId", (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    res.json({
        message: `User ${userId} fully updated.`,
        data: updateData
    });
});

// DELETE - For deleting data
app.delete("/api/users/:userId", (req, res) => {
    const { userId } = req.params;

    res.json({ message: `User ${userId} deleted successfully.` });
});


// ──────────────────────────────────────────
// 5. Catch-All 404 Route (Must be last)
// ──────────────────────────────────────────
app.use((req, res) => {
    // If no route matched above, it ends up here
    res.status(404).send("<h2>404 - Page Not Found</h2>");
});


// ──────────────────────────────────────────
// Start server
// ──────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Express Server running at http://localhost:${PORT}`);
    console.log(`Test Endpoints:`);
    console.log(`- GET  /`);
    console.log(`- GET  /api/info`);
    console.log(`- GET  /api/users/123`);
    console.log(`- GET  /api/search?q=express`);
    console.log(`- POST /api/users (with JSON Body)`);
});
