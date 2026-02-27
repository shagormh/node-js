/**
 * ============================================
 * 04 - Error Handling in Node.js
 * ============================================
 * Topics:
 *  - throw and try/catch
 *  - Error events (EventEmitter)
 *  - process uncaughtException
 *  - process unhandledRejection
 *  - Custom Error classes
 * ============================================
 */

console.log("=== Error Handling in Node.js ===\n");

// ──────────────────────────────────────────
// 1. Custom Error Classes
// ──────────────────────────────────────────
console.log("--- Custom Error Classes ---");

class DatabaseError extends Error {
    constructor(message, query) {
        super(message);
        this.name = "DatabaseError";
        this.query = query;
        this.timestamp = new Date();
    }
}

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

function saveUser(user) {
    if (!user.name) throw new ValidationError("Name is required", "name");
    if (user.id < 0) throw new DatabaseError("Invalid ID for DB", "INSERT INTO users...");
    return true;
}

try {
    saveUser({});
} catch (err) {
    if (err instanceof ValidationError) {
        console.error(`Validation Failed [${err.field}]: ${err.message}`);
    } else if (err instanceof DatabaseError) {
        console.error(`DB Error: ${err.message} (Query: ${err.query})`);
    } else {
        console.error("Unknown Error:", err);
    }
}

// ──────────────────────────────────────────
// 2. EventEmitter Errors
// ──────────────────────────────────────────
console.log("\n--- EventEmitter Errors ---");
const EventEmitter = require("events");
const emitter = new EventEmitter();

// IMPORTANT: Always add an 'error' listener!
// If an 'error' event is emitted and no listener exists, Node CRASHES.
emitter.on("error", (err) => {
    console.error("EventEmitter caught:", err.message);
});

emitter.emit("error", new Error("Something broke in the stream/event!"));

// ──────────────────────────────────────────
// 3. process Wide Error Handlers (Global Catch-Alls)
// ──────────────────────────────────────────

// A. Uncaught Exceptions (Synchronous errors)
// Note: It's best practice to log the error and let the process crash!
process.on("uncaughtException", (err) => {
    console.error("\n[CRITICAL] Uncaught Exception:", err.message);
    console.error("The app is in an undefined state. You should process.exit(1) here in production.");
    // process.exit(1);
});

// B. Unhandled Promise Rejections (Async errors without catch)
process.on("unhandledRejection", (reason, promise) => {
    console.error("\n[CRITICAL] Unhandled Rejection at:", promise, "reason:", reason);
    // process.exit(1);
});

// ──────────────────────────────────────────
// Triggering Global Handlers (for demo)
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Triggering Global Errors (Simulated Crash) ---");

    // 1. Trigger unhandledRejection
    Promise.reject(new Error("Database connection lost! (No catch block)"));

    // 2. Trigger uncaughtException (Simulating a typo or unexpected throw)
    setTimeout(() => {
        throw new Error("Unexpected synchronous crash!");
    }, 100);

}, 500);

// Cleanup
setTimeout(() => {
    console.log("\n✅ 04-error-handling.js complete!");
    process.exit(0); // Exit cleanly before real crash logic hits hard
}, 800);
