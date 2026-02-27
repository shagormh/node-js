/**
 * ============================================
 * 02 - Promises in Node.js
 * ============================================
 * Topics:
 *  - Creating promises
 *  - .then() .catch() .finally()
 *  - Promise chaining
 *  - Promise combinators: all, allSettled, race, any
 *  - util.promisify
 *  - Converting callbacks to promises
 * ============================================
 */

console.log("=== Promises in Node.js ===\n");

// ──────────────────────────────────────────
// 1. Creating a Promise
// ──────────────────────────────────────────
console.log("--- Creating Promises ---");

const successPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("✅ Success!"), 50);
});

const failurePromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("❌ Something failed!")), 50);
});

successPromise
    .then((result) => console.log("Result:", result))
    .catch((err) => console.error("Error:", err.message));

failurePromise
    .then((result) => console.log("Result:", result))
    .catch((err) => console.error("Caught:", err.message))
    .finally(() => console.log("Finally block always runs"));

// ──────────────────────────────────────────
// 2. Promise Chaining
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise Chaining ---");

    function getUser(id) {
        return new Promise((resolve) =>
            setTimeout(() => resolve({ id, name: "Alice", roleId: 2 }), 50)
        );
    }

    function getRole(roleId) {
        return new Promise((resolve) =>
            setTimeout(() => resolve({ id: roleId, name: "admin" }), 50)
        );
    }

    function getPermissions(roleName) {
        return new Promise((resolve) =>
            setTimeout(() => resolve(["read", "write", "delete"]), 50)
        );
    }

    getUser(1)
        .then((user) => {
            console.log("User:", user.name);
            return getRole(user.roleId); // return next promise
        })
        .then((role) => {
            console.log("Role:", role.name);
            return getPermissions(role.name); // return next promise
        })
        .then((permissions) => {
            console.log("Permissions:", permissions);
        })
        .catch((err) => {
            console.error("Chain error:", err.message);
        });
}, 200);

// ──────────────────────────────────────────
// 3. Promise.all - all must succeed
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise.all ---");

    const p1 = Promise.resolve("Data 1");
    const p2 = new Promise((res) => setTimeout(() => res("Data 2"), 100));
    const p3 = fetch ? Promise.resolve("Data 3") : Promise.resolve("Data 3");

    Promise.all([p1, p2, p3])
        .then((results) => console.log("All results:", results))
        .catch((err) => console.error("One failed:", err.message));

    // If one fails, all fail
    Promise.all([
        Promise.resolve("ok"),
        Promise.reject(new Error("fail")),
        Promise.resolve("ok2"),
    ]).catch((err) => console.log("Promise.all failure:", err.message));
}, 400);

// ──────────────────────────────────────────
// 4. Promise.allSettled - waits for all
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise.allSettled ---");

    Promise.allSettled([
        Promise.resolve("success"),
        Promise.reject(new Error("failure")),
        Promise.resolve("another success"),
    ]).then((results) => {
        results.forEach((result, i) => {
            if (result.status === "fulfilled") {
                console.log(`[${i}] fulfilled:`, result.value);
            } else {
                console.log(`[${i}] rejected:`, result.reason.message);
            }
        });
    });
}, 700);

// ──────────────────────────────────────────
// 5. Promise.race - first one wins
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise.race ---");

    const slow = new Promise((res) => setTimeout(() => res("slow"), 200));
    const fast = new Promise((res) => setTimeout(() => res("fast"), 50));

    Promise.race([slow, fast]).then((winner) =>
        console.log("Race winner:", winner)
    ); // fast

    // Timeout pattern with Promise.race
    function withTimeout(promise, ms) {
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
        );
        return Promise.race([promise, timeout]);
    }

    const slowTask = new Promise((res) => setTimeout(() => res("done"), 500));
    withTimeout(slowTask, 100).catch((err) => console.log("Timeout:", err.message));
}, 900);

// ──────────────────────────────────────────
// 6. Promise.any - first success wins
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise.any ---");

    Promise.any([
        Promise.reject(new Error("fail 1")),
        new Promise((res) => setTimeout(() => res("success!"), 50)),
        Promise.reject(new Error("fail 2")),
    ]).then((result) => console.log("First success:", result)); // success!

    // All fail = AggregateError
    Promise.any([
        Promise.reject(new Error("fail 1")),
        Promise.reject(new Error("fail 2")),
    ]).catch((err) => {
        console.log("All failed:", err.constructor.name); // AggregateError
        console.log("Errors:", err.errors.map((e) => e.message));
    });
}, 1100);

// ──────────────────────────────────────────
// 7. util.promisify (callback → Promise)
// ──────────────────────────────────────────
const { promisify } = require("util");
const fs = require("fs");

const readFileAsync = promisify(fs.readFile);

setTimeout(() => {
    console.log("\n--- util.promisify ---");

    readFileAsync(__filename, "utf-8")
        .then((content) => {
            const lines = content.split("\n").length;
            console.log(`This file has ${lines} lines`);
        })
        .catch((err) => console.error(err));
}, 1300);

// ──────────────────────────────────────────
// 8. Promise Queue (sequential promises)
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Sequential Promise Queue ---");

    const tasks = [
        () => new Promise((res) => setTimeout(() => res("Task 1 done"), 50)),
        () => new Promise((res) => setTimeout(() => res("Task 2 done"), 30)),
        () => new Promise((res) => setTimeout(() => res("Task 3 done"), 40)),
    ];

    tasks
        .reduce((chain, task) => chain.then(async () => console.log(await task())), Promise.resolve())
        .then(() => console.log("\n✅ 02-promises.js complete!"));
}, 1500);
