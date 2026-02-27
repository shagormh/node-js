/**
 * ============================================
 * 03 - Control Flow in Node.js
 * ============================================
 * Topics:
 *  - if/else, ternary
 *  - switch/case
 *  - for, while, do-while
 *  - for...in, for...of
 *  - break, continue
 *  - try/catch/finally
 * ============================================
 */

// ──────────────────────────────────────────
// 1. if / else if / else
// ──────────────────────────────────────────
console.log("=== if / else ===");

const score = 75;

if (score >= 90) {
    console.log("Grade: A");
} else if (score >= 80) {
    console.log("Grade: B");
} else if (score >= 70) {
    console.log("Grade: C");
} else {
    console.log("Grade: F");
}

// Ternary operator
const status = score >= 60 ? "Pass" : "Fail";
console.log("Status:", status);

// Nullish coalescing (??)
const userInput = null;
const defaultValue = userInput ?? "Default";
console.log("Nullish:", defaultValue);

// Optional chaining (?.)
const user = { profile: { name: "Alice" } };
console.log("Optional chain:", user?.profile?.name);   // Alice
console.log("Optional chain:", user?.address?.city);   // undefined (no error)

// ──────────────────────────────────────────
// 2. switch / case
// ──────────────────────────────────────────
console.log("\n=== switch / case ===");

const day = new Date().getDay(); // 0=Sun, 1=Mon, ...

switch (day) {
    case 0:
        console.log("Sunday - Rest day!");
        break;
    case 1:
        console.log("Monday - Start of work week!");
        break;
    case 5:
    case 6:
        console.log("Weekend!");
        break;
    default:
        console.log("Weekday");
}

// ──────────────────────────────────────────
// 3. for Loops
// ──────────────────────────────────────────
console.log("\n=== for loops ===");

// Classic for loop
for (let i = 1; i <= 5; i++) {
    process.stdout.write(`${i} `);
}
console.log();

// Reverse loop
for (let i = 5; i >= 1; i--) {
    process.stdout.write(`${i} `);
}
console.log();

// for...of (arrays, strings)
const colors = ["red", "green", "blue"];
for (const color of colors) {
    console.log("Color:", color);
}

// for...in (object keys)
const car = { brand: "Toyota", model: "Camry", year: 2022 };
for (const key in car) {
    console.log(`${key}: ${car[key]}`);
}

// ──────────────────────────────────────────
// 4. while & do...while
// ──────────────────────────────────────────
console.log("\n=== while / do-while ===");

let count = 0;
while (count < 5) {
    process.stdout.write(`${count} `);
    count++;
}
console.log();

// do-while (always executes at least once)
let num = 10;
do {
    console.log("do-while:", num);
    num++;
} while (num < 10); // condition false, but body ran once

// ──────────────────────────────────────────
// 5. break & continue
// ──────────────────────────────────────────
console.log("\n=== break & continue ===");

for (let i = 0; i < 10; i++) {
    if (i === 5) break;         // stop at 5
    if (i % 2 === 0) continue;  // skip even numbers
    process.stdout.write(`${i} `);
}
console.log(); // 1 3

// ──────────────────────────────────────────
// 6. try / catch / finally
// ──────────────────────────────────────────
console.log("\n=== try / catch / finally ===");

function divide(a, b) {
    if (b === 0) throw new Error("Cannot divide by zero!");
    return a / b;
}

try {
    console.log(divide(10, 2));   // 5
    console.log(divide(10, 0));   // throws
} catch (error) {
    console.error("Error caught:", error.message);
} finally {
    console.log("This always runs");
}

// Specific error types
try {
    JSON.parse("{ invalid json }");
} catch (e) {
    if (e instanceof SyntaxError) {
        console.log("JSON SyntaxError:", e.message);
    }
}

console.log("\n✅ 03-control-flow.js complete!");
