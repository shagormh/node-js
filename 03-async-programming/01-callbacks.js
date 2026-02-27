/**
 * ============================================
 * 01 - Callbacks in Node.js
 * ============================================
 * Topics:
 *  - Callback pattern (error-first)
 *  - Callback hell (pyramid of doom)
 *  - Avoiding callback hell
 *  - callbackify
 * ============================================
 */

console.log("=== Callbacks in Node.js ===\n");

// ──────────────────────────────────────────
// 1. Error-First Callback Pattern
// ──────────────────────────────────────────
console.log("--- Error-First Callbacks ---");

// Node.js convention: callback(error, result)
function readUserFromDB(id, callback) {
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error(`Invalid ID: ${id}`));
            return;
        }
        callback(null, { id, name: "Alice", email: "alice@example.com" });
    }, 50);
}

// Successful call
readUserFromDB(1, (err, user) => {
    if (err) return console.error("Error:", err.message);
    console.log("User found:", user);
});

// Failed call
readUserFromDB(-1, (err, user) => {
    if (err) return console.error("Error:", err.message);
    console.log("User:", user);
});

// ──────────────────────────────────────────
// 2. Callback Hell (what NOT to do)
// ──────────────────────────────────────────
function getUser(id, cb) {
    setTimeout(() => cb(null, { id, name: "Alice" }), 50);
}

function getOrders(userId, cb) {
    setTimeout(() => cb(null, [{ orderId: 1, item: "Book" }, { orderId: 2, item: "Laptop" }]), 50);
}

function getOrderDetails(orderId, cb) {
    setTimeout(() => cb(null, { orderId, amount: 99.99, status: "shipped" }), 50);
}

// ❌ Callback Hell - deeply nested
setTimeout(() => {
    console.log("\n--- Callback Hell (nested) ---");
    getUser(1, (err, user) => {
        if (err) return console.error(err);
        console.log("User:", user.name);
        getOrders(user.id, (err2, orders) => {
            if (err2) return console.error(err2);
            console.log("Orders:", orders.length);
            getOrderDetails(orders[0].orderId, (err3, details) => {
                if (err3) return console.error(err3);
                console.log("First order:", details);
                // Imagine more nesting here - this is "callback hell"
            });
        });
    });
}, 150);

// ──────────────────────────────────────────
// 3. Avoiding Callback Hell - Named Functions
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Named Functions (flat callbacks) ---");

    function handleOrderDetails(err, details) {
        if (err) return console.error(err);
        console.log("Details:", details);
    }

    function handleOrders(err, orders) {
        if (err) return console.error(err);
        getOrderDetails(orders[0].orderId, handleOrderDetails);
    }

    function handleUser(err, user) {
        if (err) return console.error(err);
        getOrders(user.id, handleOrders);
    }

    getUser(1, handleUser);
}, 500);

// ──────────────────────────────────────────
// 4. Async Parallel with Callbacks
// ──────────────────────────────────────────
function asyncTask(name, delay, cb) {
    setTimeout(() => cb(null, `${name} done`), delay);
}

function runParallel(tasks, done) {
    const results = [];
    let completed = 0;
    const total = tasks.length;

    if (total === 0) return done(null, []);

    tasks.forEach(({ name, delay }, index) => {
        asyncTask(name, delay, (err, result) => {
            if (err) return done(err);
            results[index] = result;
            completed++;
            if (completed === total) done(null, results);
        });
    });
}

setTimeout(() => {
    console.log("\n--- Parallel Callbacks ---");
    const tasks = [
        { name: "Task A", delay: 100 },
        { name: "Task B", delay: 50 },
        { name: "Task C", delay: 80 },
    ];

    runParallel(tasks, (err, results) => {
        if (err) return console.error(err);
        console.log("All parallel results:", results);
    });
}, 800);

// ──────────────────────────────────────────
// 5. util.callbackify (Promise → Callback)
// ──────────────────────────────────────────
const { callbackify } = require("util");

async function fetchDataAsync(id) {
    if (id < 0) throw new Error("ID must be positive");
    return { id, data: "fetched data" };
}

// Convert async function to callback style
const fetchDataCb = callbackify(fetchDataAsync);

setTimeout(() => {
    console.log("\n--- util.callbackify ---");
    fetchDataCb(1, (err, result) => {
        if (err) return console.error(err.message);
        console.log("callbackify result:", result);
        console.log("\n✅ 01-callbacks.js complete!");
    });
}, 1000);
