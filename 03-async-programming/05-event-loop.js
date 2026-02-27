/**
 * ============================================
 * 05 - The Event Loop in Node.js
 * ============================================
 * Demonstrates the execution order of different
 * asynchronous phases in Node.js.
 * ============================================
 */

const fs = require("fs");

console.log("=== Node.js Event Loop Execution Order ===\n");

console.log("1. Script Start (Synchronous)");

// Timer Phase
setTimeout(() => console.log("   -> setTimeout (Timers Phase)"), 0);

// Check Phase
setImmediate(() => console.log("   -> setImmediate (Check Phase)"));

// Microtasks (Promises & process.nextTick)
Promise.resolve().then(() => console.log("   -> Promise 1 (Microtask queue)"));
process.nextTick(() => console.log("   -> nextTick 1 (Microtask queue - HIGHEST priority)"));

// I/O Phase
fs.readFile(__filename, () => {
    console.log("\n2. I/O Callback Finished (Poll Phase)");

    // Inside I/O callback, setImmediate runs BEFORE setTimeout!
    setTimeout(() => console.log("   -> Inside I/O: setTimeout (Timers Phase)"), 0);
    setImmediate(() => console.log("   -> Inside I/O: setImmediate (Check Phase) - Runs FIRST inside I/O"));

    process.nextTick(() => console.log("   -> Inside I/O: nextTick (Microtask)"));
});

console.log("3. Script End (Synchronous)");

/*
  EXPECTED ORDER OUTPUT:
  1. Script Start
  3. Script End
     -> nextTick 1
     -> Promise 1
     -> setTimeout
     -> setImmediate
  2. I/O Callback Finished
     -> Inside I/O: nextTick
     -> Inside I/O: setImmediate
     -> Inside I/O: setTimeout
*/
