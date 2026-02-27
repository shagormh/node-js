/**
 * ============================================
 * 04 - Functions in Node.js
 * ============================================
 * Topics:
 *  - Function declaration & expression
 *  - Arrow functions
 *  - Default & rest parameters
 *  - IIFE (Immediately Invoked Function Expression)
 *  - Higher-order functions
 *  - Closures
 *  - Currying
 *  - Recursion
 * ============================================
 */

// ──────────────────────────────────────────
// 1. Function Declaration
// ──────────────────────────────────────────
console.log("=== Function Declaration ===");

// Can be called before definition (hoisted)
console.log(greet("Alice")); // Hello, Alice!

function greet(name) {
    return `Hello, ${name}!`;
}

// ──────────────────────────────────────────
// 2. Function Expression
// ──────────────────────────────────────────
console.log("\n=== Function Expression ===");

const add = function (a, b) {
    return a + b;
};
console.log("Add:", add(5, 3)); // 8

// Named function expression (useful for recursion/debugging)
const factorial = function fact(n) {
    return n <= 1 ? 1 : n * fact(n - 1);
};
console.log("Factorial:", factorial(5)); // 120

// ──────────────────────────────────────────
// 3. Arrow Functions
// ──────────────────────────────────────────
console.log("\n=== Arrow Functions ===");

const multiply = (a, b) => a * b;
const square = (n) => n * n;
const sayHello = () => "Hello!";

console.log(multiply(4, 5));  // 20
console.log(square(7));       // 49
console.log(sayHello());      // Hello!

// Arrow functions and 'this'
function Timer() {
    this.seconds = 0;
    // Arrow function uses 'this' from outer scope (Timer)
    setInterval(() => {
        this.seconds++;
        if (this.seconds >= 3) process.exit(0); // cleanup for demo
    }, 1000);
}

// ──────────────────────────────────────────
// 4. Default & Rest Parameters
// ──────────────────────────────────────────
console.log("\n=== Default & Rest Parameters ===");

function createUser(name, role = "user", active = true) {
    return { name, role, active };
}
console.log(createUser("Bob"));              // { name: 'Bob', role: 'user', active: true }
console.log(createUser("Admin", "admin"));   // { role: 'admin' }

function sumAll(...numbers) {
    return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("Sum:", sumAll(1, 2, 3, 4, 5)); // 15

// ──────────────────────────────────────────
// 5. IIFE - Immediately Invoked Function Expression
// ──────────────────────────────────────────
console.log("\n=== IIFE ===");

// Runs immediately, creates its own scope
const result = (function (x, y) {
    return x + y;
})(10, 20);

console.log("IIFE result:", result); // 30

// Async IIFE
(async () => {
    const data = await Promise.resolve("Async IIFE data");
    console.log(data);
})();

// ──────────────────────────────────────────
// 6. Higher-Order Functions
// ──────────────────────────────────────────
console.log("\n=== Higher-Order Functions ===");

// map, filter, reduce
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const doubled = numbers.map((n) => n * 2);
console.log("Doubled:", doubled);

const evens = numbers.filter((n) => n % 2 === 0);
console.log("Evens:", evens);

const total = numbers.reduce((acc, n) => acc + n, 0);
console.log("Total:", total);

// Chaining
const result2 = numbers
    .filter((n) => n % 2 === 0)
    .map((n) => n * n)
    .reduce((acc, n) => acc + n, 0);
console.log("Even squares sum:", result2); // 220

// Function as argument
function applyToAll(arr, fn) {
    return arr.map(fn);
}
console.log(applyToAll([1, 2, 3], (x) => x * 3)); // [3, 6, 9]

// Function returning function
function createMultiplier(factor) {
    return (number) => number * factor;
}
const triple = createMultiplier(3);
console.log("Triple of 7:", triple(7)); // 21

// ──────────────────────────────────────────
// 7. Closures
// ──────────────────────────────────────────
console.log("\n=== Closures ===");

function makeCounter(start = 0) {
    let count = start; // private variable
    return {
        increment: () => ++count,
        decrement: () => --count,
        reset: () => { count = start; },
        getValue: () => count,
    };
}

const counter = makeCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
counter.reset();
console.log(counter.getValue());  // 10

// ──────────────────────────────────────────
// 8. Currying
// ──────────────────────────────────────────
console.log("\n=== Currying ===");

// Curried add: add(a)(b)(c)
const curriedAdd = (a) => (b) => (c) => a + b + c;
console.log(curriedAdd(1)(2)(3)); // 6

const add5 = curriedAdd(5);
const add5and10 = add5(10);
console.log(add5and10(20)); // 35

// ──────────────────────────────────────────
// 9. Recursion
// ──────────────────────────────────────────
console.log("\n=== Recursion ===");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log("Fibonacci(10):", fibonacci(10)); // 55

function deepFlatten(arr) {
    return arr.reduce((acc, val) =>
        Array.isArray(val) ? acc.concat(deepFlatten(val)) : acc.concat(val), []);
}
console.log("Flatten:", deepFlatten([1, [2, [3, [4, [5]]]]])); // [1,2,3,4,5]

console.log("\n✅ 04-functions.js complete!");
