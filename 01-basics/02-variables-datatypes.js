/**
 * ============================================
 * 02 - Variables & Data Types in Node.js
 * ============================================
 * Topics:
 *  - var, let, const
 *  - Primitive & Reference types
 *  - Type coercion & conversion
 *  - Template literals
 *  - Destructuring
 *  - Spread & Rest operators
 * ============================================
 */

// ──────────────────────────────────────────
// 1. var, let, const
// ──────────────────────────────────────────
console.log("=== var / let / const ===");

var name = "Alice";       // function-scoped, re-declarable
let age = 25;             // block-scoped, re-assignable
const PI = 3.14159;       // block-scoped, NOT re-assignable

// var hoisting example
console.log(hoisted);     // undefined (not error)
var hoisted = "I am hoisted";
console.log(hoisted);

// let is NOT hoisted
// console.log(notHoisted); // ReferenceError
// let notHoisted = "test";

console.log(name, age, PI);

// ──────────────────────────────────────────
// 2. Primitive Data Types
// ──────────────────────────────────────────
console.log("\n=== Primitive Types ===");

const str = "Hello";           // String
const num = 42;                // Number
const float = 3.14;            // Number (float)
const bool = true;             // Boolean
const nothing = null;          // Null
let undef;                     // Undefined
const big = 9007199254740991n; // BigInt
const sym = Symbol("id");      // Symbol

console.log(typeof str, typeof num, typeof bool, typeof nothing);
console.log(typeof undef, typeof big, typeof sym);

// ──────────────────────────────────────────
// 3. Reference Types
// ──────────────────────────────────────────
console.log("\n=== Reference Types ===");

// Object
const person = { name: "Bob", age: 30 };
console.log("Object:", person);

// Array
const fruits = ["apple", "banana", "cherry"];
console.log("Array:", fruits);

// Function
const greet = function (n) { return `Hello, ${n}!`; };
console.log("Function:", greet("Alice"));

// Date
const now = new Date();
console.log("Date:", now.toLocaleDateString());

// ──────────────────────────────────────────
// 4. Type Conversion
// ──────────────────────────────────────────
console.log("\n=== Type Conversion ===");

// String to Number
const numStr = "42";
console.log(Number(numStr));       // 42
console.log(parseInt("42px"));    // 42
console.log(parseFloat("3.14px")); // 3.14

// Number to String
const n = 100;
console.log(String(n));            // "100"
console.log(n.toString());         // "100"
console.log(`${n}`);               // "100"

// Boolean conversion
console.log(Boolean(0));           // false
console.log(Boolean(""));          // false
console.log(Boolean(null));        // false
console.log(Boolean("hello"));     // true
console.log(Boolean(1));           // true

// ──────────────────────────────────────────
// 5. Template Literals
// ──────────────────────────────────────────
console.log("\n=== Template Literals ===");

const firstName = "Shagor";
const lastName = "MH";
const fullName = `${firstName} ${lastName}`;
const multiLine = `
  Name: ${fullName}
  Age: ${age}
  PI: ${PI.toFixed(2)}
`;
console.log(multiLine);

// ──────────────────────────────────────────
// 6. Destructuring
// ──────────────────────────────────────────
console.log("\n=== Destructuring ===");

// Array destructuring
const [first, second, ...rest] = ["a", "b", "c", "d", "e"];
console.log(first, second, rest); // a b ['c', 'd', 'e']

// Object destructuring
const { name: personName, age: personAge, city = "Dhaka" } = person;
console.log(personName, personAge, city); // Bob 30 Dhaka

// Nested destructuring
const { address: { street = "N/A" } = {} } = { address: { street: "123 Main St" } };
console.log(street); // 123 Main St

// ──────────────────────────────────────────
// 7. Spread & Rest Operators
// ──────────────────────────────────────────
console.log("\n=== Spread & Rest ===");

// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log("Combined array:", combined);

// Spread in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log("Merged object:", merged);

// Rest in functions
function addAll(...nums) {
    return nums.reduce((acc, val) => acc + val, 0);
}
console.log("Sum (rest):", addAll(1, 2, 3, 4, 5)); // 15

console.log("\n✅ 02-variables-datatypes.js complete!");
