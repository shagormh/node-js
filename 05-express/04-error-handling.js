/**
 * ============================================
 * 04 - Error Handling Middleware in Express
 * ============================================
 * Topics:
 *  - Synchronous error handling (automatic)
 *  - Asynchronous error handling (requires next(err))
 *  - Custom error handling middleware
 *  - Catching 404s
 * ============================================
 */

const express = require("express");
const app = express();
const PORT = 4003;

app.use(express.json());

// ──────────────────────────────────────────
// 1. Synchronous Errors
// ──────────────────────────────────────────
// Express catches synchronous errors automatically inside route handlers
app.get("/sync-error", (req, res) => {
    throw new Error("This is a synchronous error!");
    // Execution stops here, Express catches the error and passes it to the error handler
});

// ──────────────────────────────────────────
// 2. Asynchronous Errors
// ──────────────────────────────────────────
// Express default error handler DOES NOT catch async errors implicitly (before Express 5)
// You MUST pass the error to `next(err)` inside `catch()`
app.get("/async-error", async (req, res, next) => {
    try {
        const data = await Promise.reject(new Error("Async Database Failure!"));
        res.json(data);
    } catch (error) {
        // Pass to custom error handler
        next(error);
    }
});

// Helper for Async Route Handlers (avoids writing try/catch everywhere)
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/wrapped-async-error", catchAsync(async (req, res, next) => {
    // We can throw directly here, `catchAsync` handles passing it to next()
    throw new Error("Wrapped Async Error -> Caught automatically!");
}));


// ──────────────────────────────────────────
// 3. 404 Handler (Catch-all for unknown routes)
// ──────────────────────────────────────────
// Put this AFTER all valid routes and BEFORE the error handler
app.use((req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.status = 404;
    next(err); // Pass the 404 error to the global error handler
});


// ──────────────────────────────────────────
// 4. Global Error Handling Middleware
// ──────────────────────────────────────────
// Error-handling middleware ALWAYS takes 4 arguments: (err, req, res, next)
app.use((err, req, res, next) => {
    // Determine status code (default to 500 Internal Server Error)
    const statusCode = err.status || 500;

    console.error(`[ERROR] ${statusCode} - ${err.message}`);

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message,
            // Only show stack trace in development
            stack: process.env.NODE_ENV === "production" ? null : err.stack
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Error Handling Server running at http://localhost:${PORT}`);
    console.log("Test URLs:");
    console.log("  - http://localhost:4003/sync-error");
    console.log("  - http://localhost:4003/async-error");
    console.log("  - http://localhost:4003/wrapped-async-error");
    console.log("  - http://localhost:4003/non-existent-route (404)");
});
