/**
 * ============================================
 * 08 - Timers in Node.js
 * ============================================
 * Topics:
 *  - setTimeout / clearTimeout
 *  - setInterval / clearInterval
 *  - setImmediate / clearImmediate
 *  - process.nextTick
 *  - queueMicrotask
 *  - Execution order in event loop
 *  - Promise-based delays
 * ============================================
 */

console.log("=== Timers in Node.js ===\n");

// ──────────────────────────────────────────
// 1. setTimeout
// ──────────────────────────────────────────
console.log("--- setTimeout ---");

// Basic usage
const timeoutId = setTimeout(() => {
    console.log("⏰ setTimeout fired after 100ms");
}, 100);

// Clear a timeout before it fires
const cancelledId = setTimeout(() => {
    console.log("❌ This will NOT print (cancelled)");
}, 200);
clearTimeout(cancelledId);

// setTimeout with arguments
setTimeout((msg, count) => {
    console.log(`Message: ${msg}, Count: ${count}`);
}, 150, "hello", 42);

// ──────────────────────────────────────────
// 2. setInterval
// ──────────────────────────────────────────
console.log("\n--- setInterval ---");

let ticks = 0;
const intervalId = setInterval(() => {
    ticks++;
    process.stdout.write(`tick(${ticks}) `);
    if (ticks >= 3) {
        clearInterval(intervalId);
        console.log("\n✅ Interval stopped after 3 ticks");
    }
}, 80); // fires every 80ms

// ──────────────────────────────────────────
// 3. setImmediate
// ──────────────────────────────────────────
// setImmediate fires AFTER I/O events in the same iteration
console.log("\n--- setImmediate ---");

setImmediate(() => {
    console.log("setImmediate fired");
});

const immediateId = setImmediate(() => {
    console.log("❌ This won't print (clearImmediate)");
});
clearImmediate(immediateId);

// ──────────────────────────────────────────
// 4. process.nextTick - highest priority
// ──────────────────────────────────────────
// nextTick fires BEFORE any other async callback
// Use sparingly - can starve I/O if overused

console.log("\n--- process.nextTick ---");

process.nextTick(() => {
    console.log("process.nextTick 1");
});

process.nextTick(() => {
    console.log("process.nextTick 2");
});

setImmediate(() => {
    console.log("setImmediate (after nextTick)");
});

// ──────────────────────────────────────────
// 5. Event Loop Execution Order
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Event Loop Execution Order ---");
    console.log("Expected order:");
    console.log("  1. nextTick callbacks (microtask queue)");
    console.log("  2. Promise callbacks (microtask queue)");
    console.log("  3. setImmediate (check phase)");
    console.log("  4. setTimeout with 0ms (timers phase)");
    console.log("");

    process.nextTick(() => console.log("1. nextTick"));

    Promise.resolve().then(() => console.log("2. Promise.resolve"));

    setImmediate(() => console.log("3. setImmediate"));

    setTimeout(() => console.log("4. setTimeout(0)"), 0);
}, 400);

// ──────────────────────────────────────────
// 6. Promise-based Delay (sleep utility)
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n--- Promise-based Sleep ---");

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function demo() {
        console.log("Start...");
        await sleep(100);
        console.log("After 100ms...");
        await sleep(100);
        console.log("After another 100ms...");

        // Node 16+ timers/promises
        const { setTimeout: setTimeoutAsync } = require("timers/promises");
        await setTimeoutAsync(50, "resolved value").then((val) => {
            console.log("timers/promises value:", val);
        });

        console.log("Done!");
    }

    demo().then(() => {
        // ──────────────────────────────────────
        // 7. Interval as async iterator (Node 16+)
        // ──────────────────────────────────────
        setTimeout(() => {
            console.log("\n--- Interval as Async Iterator ---");
            const { setInterval: setIntervalAsync } = require("timers/promises");

            let count2 = 0;
            (async () => {
                for await (const _ of setIntervalAsync(50)) {
                    count2++;
                    process.stdout.write(`[${count2}]`);
                    if (count2 >= 3) break;
                }
                console.log("\n✅ 08-timers.js complete!");
            })();
        }, 100);
    });
}, 700);
