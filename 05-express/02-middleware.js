/**
 * ============================================
 * 02 - Express Middleware
 * ============================================
 * Topics:
 *  - What is middleware?
 *  - Application-level middleware
 *  - Route-level middleware
 *  - Third-party middleware (cors, morgan equivalents)
 *  - Execution order (next())
 * ============================================
 */

const express = require("express");
const app = express();
const PORT = 4001;

console.log("=== Express Middleware Demo ===\n");

// ──────────────────────────────────────────
// 1. Application-Level Middleware (Runs on EVERY request)
// ──────────────────────────────────────────

// Simple Logger Middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

    // MUST call next() or the request hangs
    next();
};

// Response Time Measurement Middleware
const responseTime = (req, res, next) => {
    const start = Date.now();

    // Listen for the 'finish' event on the response object
    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(`> Request took ${duration}ms`);
    });

    next();
};

// Register Application middlewares
app.use(requestLogger);
app.use(responseTime);
app.use(express.json()); // Built-in parsing middleware

// ──────────────────────────────────────────
// 2. Route-Level Middleware (Runs only for specific routes)
// ──────────────────────────────────────────

// Auth Check Middleware
const requireAuth = (req, res, next) => {
    // In a real app, you'd check a JWT or Session token here.
    // We'll simulate auth checking via a query parameter: ?token=mySecretToken
    const token = req.query.token || req.headers["authorization"];

    if (token && token === "mySecretToken") {
        // Inject user info into the request object to pass down the chain
        req.user = { id: 1, name: "Alice", role: "admin" };
        console.log("Auth passed.");
        next();
    } else {
        // Stop the req-res cycle and return an error
        console.log("Auth failed.");
        res.status(401).json({ error: "Unauthorized access! Missing or invalid token." });
    }
};

// Admin Check Middleware (Assumes requireAuth has already run)
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        console.log("Admin verified.");
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Admins only." });
    }
};

// ──────────────────────────────────────────
// 3. Applying Middlewares to Routes
// ──────────────────────────────────────────

// Public route - skips auth
app.get("/", (req, res) => {
    res.send("Public Homepage. Everyone can see this.");
});

// Protected route - requires auth (run requireAuth first)
app.get("/api/dashboard", requireAuth, (req, res) => {
    // Since requireAuth succeeded, req.user exists
    res.json({
        message: "Welcome to your protected dashboard",
        currentUser: req.user
    });
});

// Admin strictly protected route (Chaining multiple middlewares)
app.get("/api/admin-panel", requireAuth, requireAdmin, (req, res) => {
    res.json({
        message: "Super secret admin controls accessible",
        status: "success"
    });
});

// Route Level Middleware applied to an array of routes or prefix string
const apiLimiter = (req, res, next) => {
    console.log("Rate limit checked...");
    next();
};
app.use("/api/v2", apiLimiter);

app.get("/api/v2/test", (req, res) => {
    res.send("V2 Endpoint with rate limiter setup.");
});

// ──────────────────────────────────────────
// 4. Start Server
// ──────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Middleware Server running at http://localhost:${PORT}`);
    console.log(`\nTest commands:`);
    console.log(`1. Public: curl http://localhost:${PORT}/`);
    console.log(`2. Fail:   curl http://localhost:${PORT}/api/dashboard`);
    console.log(`3. Pass:   curl http://localhost:${PORT}/api/dashboard?token=mySecretToken`);
    console.log(`4. Admin:  curl http://localhost:${PORT}/api/admin-panel?token=mySecretToken`);
});
