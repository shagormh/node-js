/**
 * ============================================
 * 03 - Session Authentication
 * ============================================
 * Topics:
 *  - Setting up express-session
 *  - Storing data in a session cookie
 *  - Logging in and logging out
 *  - Protecting routes with session checks
 * ============================================
 * Note: Requires `npm install express express-session`
 */

const express = require("express");
const session = require("express-session");

const app = express();
const PORT = 4004;

console.log("=== Session Authentication Demo ===\n");

// Parse JSON bodies
app.use(express.json());

// ──────────────────────────────────────────
// 1. Configure Session Middleware
// ──────────────────────────────────────────
app.use(session({
    // The secret used to sign the session ID cookie (Keep this hidden in .env!)
    secret: "my-super-secret-session-key",
    // Forces the session to be saved back to the session store, even if the session was never modified
    resave: false,
    // Forces a session that is "uninitialized" to be saved to the store
    saveUninitialized: false,
    // Cookie settings
    cookie: {
        secure: false, // Set to true in production if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day in milliseconds
    }
}));

// Mock Database
const users = [
    { id: 1, username: "admin", password: "password123" } // In reality, password should be hashed!
];

// ──────────────────────────────────────────
// 2. Login Route
// ──────────────────────────────────────────
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Authentication successful
        // Store user info in the session object
        req.session.isLoggedIn = true;
        req.session.user = { id: user.id, username: user.username };

        console.log(`User ${user.username} logged in. Session ID: ${req.session.id}`);

        res.json({ message: "Login successful!", sessionID: req.session.id });
    } else {
        // Auth failed
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// ──────────────────────────────────────────
// 3. Protected Route (Middleware Check)
// ──────────────────────────────────────────
const requireSessionAuth = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        next(); // User is authenticated, proceed
    } else {
        res.status(401).json({ error: "Unauthorized. Please log in first." });
    }
};

app.get("/dashboard", requireSessionAuth, (req, res) => {
    // If we reach here, the middleware passed
    res.json({
        message: "Welcome to your protected dashboard",
        user: req.session.user
    });
});

// ──────────────────────────────────────────
// 4. Logout Route
// ──────────────────────────────────────────
app.post("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).json({ error: "Could not log out." });
        }

        // Clear the cookie from the client
        res.clearCookie("connect.sid"); // 'connect.sid' is the default cookie name
        res.json({ message: "Logout successful" });
    });
});

// ──────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Session Auth Server running at http://localhost:${PORT}`);
    console.log("Test flows (use a tool like Postman that preserves cookies):");
    console.log("1. GET  /dashboard -> (Fails, 401)");
    console.log("2. POST /login     -> JSON { \"username\": \"admin\", \"password\": \"password123\" }");
    console.log("3. GET  /dashboard -> (Succeeds with user data)");
    console.log("4. POST /logout    -> (Clears session)");
});
