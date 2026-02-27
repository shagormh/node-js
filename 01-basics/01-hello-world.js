/**
 * ============================================
 * 01 - Hello World in Node.js
 * ============================================
 * Topics:
 *  - console methods
 *  - process object
 *  - global vs window
 *  - __dirname, __filename, require, module
 * ============================================
 */

// ──────────────────────────────────────────
// 1. Basic Console Output
// ──────────────────────────────────────────
console.log("Hello, World!");
console.log("Welcome to Node.js!");

// ──────────────────────────────────────────
// 2. Console Methods
// ──────────────────────────────────────────
console.log("✅ This is a log");
console.warn("⚠️  This is a warning");
console.error("❌ This is an error");
console.info("ℹ️  This is info");

// console.table
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 28 },
];
console.table(users);

// console.time - measure execution time
console.time("Loop Timer");
let sum = 0;
for (let i = 0; i < 1_000_000; i++) {
  sum += i;
}
console.timeEnd("Loop Timer");
console.log("Sum:", sum);

// ──────────────────────────────────────────
// 3. Process Object
// ──────────────────────────────────────────
console.log("\n--- process object ---");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
console.log("Architecture:", process.arch);
console.log("Process ID:", process.pid);
console.log("Current directory:", process.cwd());
console.log("Env NODE_ENV:", process.env.NODE_ENV || "not set");

// process.argv - command line arguments
// Run: node 01-hello-world.js arg1 arg2
console.log("\nCommand line arguments:", process.argv);

// ──────────────────────────────────────────
// 4. Global Variables in Node.js
// ──────────────────────────────────────────
console.log("\n--- Globals ---");
console.log("__dirname:", __dirname);   // current folder absolute path
console.log("__filename:", __filename); // current file absolute path

// ──────────────────────────────────────────
// 5. Module System Basics
// ──────────────────────────────────────────
console.log("\n--- Module info ---");
console.log("module.id:", module.id);
console.log("module.filename:", module.filename);
console.log("module.loaded:", module.loaded);

// Exit process
// process.exit(0); // 0 = success, 1 = error

console.log("\n✅ 01-hello-world.js complete!");
