/**
 * ============================================
 * 04 - events Module (EventEmitter)
 * ============================================
 * Node.js is event-driven. EventEmitter is the
 * backbone of Node's async architecture.
 * ============================================
 */

const EventEmitter = require("events");

console.log("=== EventEmitter ===\n");

// ──────────────────────────────────────────
// 1. Basic EventEmitter
// ──────────────────────────────────────────
console.log("--- Basic Usage ---");

const emitter = new EventEmitter();

// Register listener
emitter.on("greet", (name) => {
    console.log(`Hello, ${name}! 👋`);
});

// One-time listener
emitter.once("connect", () => {
    console.log("Connected! (fires only once)");
});

// Emit events
emitter.emit("greet", "Alice");   // Hello, Alice!
emitter.emit("greet", "Bob");     // Hello, Bob!
emitter.emit("connect");          // Connected!
emitter.emit("connect");          // (nothing - once() was used)

// ──────────────────────────────────────────
// 2. Custom EventEmitter Class
// ──────────────────────────────────────────
console.log("\n--- Custom EventEmitter Class ---");

class LogEmitter extends EventEmitter {
    log(level, message) {
        const timestamp = new Date().toISOString();
        this.emit("log", { level, message, timestamp });

        if (level === "error") {
            this.emit("error-log", message);
        }
    }
}

const logger = new LogEmitter();

logger.on("log", ({ level, message, timestamp }) => {
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
});

logger.on("error-log", (message) => {
    console.error(`🔴 Critical error detected: ${message}`);
});

logger.log("info", "Server started on port 3000");
logger.log("warn", "Memory usage is high");
logger.log("error", "Database connection failed!");

// ──────────────────────────────────────────
// 3. Data Store with Events
// ──────────────────────────────────────────
console.log("\n--- Data Store with Events ---");

class DataStore extends EventEmitter {
    #data = new Map();

    set(key, value) {
        const isUpdate = this.#data.has(key);
        this.#data.set(key, value);
        this.emit(isUpdate ? "update" : "add", key, value);
        this.emit("change", this.#data.size);
    }

    get(key) { return this.#data.get(key); }

    delete(key) {
        if (this.#data.has(key)) {
            this.#data.delete(key);
            this.emit("delete", key);
            this.emit("change", this.#data.size);
        }
    }

    get size() { return this.#data.size; }
}

const store = new DataStore();

store.on("add", (k, v) => console.log(`➕ Added: ${k} = ${JSON.stringify(v)}`));
store.on("update", (k, v) => console.log(`✏️  Updated: ${k} = ${JSON.stringify(v)}`));
store.on("delete", (k) => console.log(`🗑️  Deleted: ${k}`));
store.on("change", (size) => console.log(`📦 Store size: ${size}`));

store.set("user:1", { name: "Alice" });
store.set("user:2", { name: "Bob" });
store.set("user:1", { name: "Alice Updated" });
store.delete("user:2");

// ──────────────────────────────────────────
// 4. Error Events
// ──────────────────────────────────────────
console.log("\n--- Error Events ---");

const safeEmitter = new EventEmitter();

// IMPORTANT: Always add error listener to avoid crashes
safeEmitter.on("error", (err) => {
    console.error("Caught error:", err.message);
});

safeEmitter.emit("error", new Error("Something went wrong"));

// ──────────────────────────────────────────
// 5. Listener Management
// ──────────────────────────────────────────
console.log("\n--- Listener Management ---");

const mgr = new EventEmitter();

const handler1 = () => console.log("Handler 1");
const handler2 = () => console.log("Handler 2");

mgr.on("test", handler1);
mgr.on("test", handler2);

console.log("Listener count:", mgr.listenerCount("test")); // 2
console.log("Listeners:", mgr.listeners("test").length);

mgr.emit("test"); // Handler 1, Handler 2

// Remove a specific listener
mgr.off("test", handler1);
console.log("After remove:", mgr.listenerCount("test")); // 1
mgr.emit("test"); // Handler 2

// Remove all listeners
mgr.removeAllListeners("test");
console.log("After removeAll:", mgr.listenerCount("test")); // 0

// Set max listeners (default is 10, avoid memory leak warning)
mgr.setMaxListeners(20);

// ──────────────────────────────────────────
// 6. Async Event Handling
// ──────────────────────────────────────────
console.log("\n--- Async Event Handling ---");

const asyncEmitter = new EventEmitter();

asyncEmitter.on("data", async (payload) => {
    // Simulate async processing
    await new Promise((res) => setTimeout(res, 50));
    console.log("Async processed:", payload);
});

asyncEmitter.emit("data", { id: 1, message: "Hello async!" });

console.log("\n✅ 04-events-module.js complete!");
