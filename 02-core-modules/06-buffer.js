/**
 * ============================================
 * 06 - Buffer in Node.js
 * ============================================
 * Buffers handle raw binary data (outside V8 heap)
 * Used with: files, streams, network packets, crypto
 * ============================================
 */

console.log("=== Buffer in Node.js ===\n");

// ──────────────────────────────────────────
// 1. Creating Buffers
// ──────────────────────────────────────────
console.log("--- Creating Buffers ---");

// Allocate buffer (filled with zeros)
const buf1 = Buffer.alloc(10);
console.log("alloc(10):", buf1);

// Allocate with fill value
const buf2 = Buffer.alloc(5, 0xff);
console.log("alloc(5, 0xff):", buf2);

// From string
const buf3 = Buffer.from("Hello, World!", "utf-8");
console.log("from string:", buf3);
console.log("length:", buf3.length, "bytes");

// From array of bytes
const buf4 = Buffer.from([72, 101, 108, 108, 111]);
console.log("from array:", buf4.toString()); // Hello

// From another buffer (copy)
const buf5 = Buffer.from(buf3);
console.log("from Buffer:", buf5.equals(buf3)); // true

// Unsafe (fast but may contain old data)
const buf6 = Buffer.allocUnsafe(8);
buf6.fill(0); // always fill before use!
console.log("allocUnsafe filled:", buf6);

// ──────────────────────────────────────────
// 2. Reading Buffers
// ──────────────────────────────────────────
console.log("\n--- Reading Buffers ---");

const greeting = Buffer.from("Hello, Node.js!");

// toString with encoding
console.log("utf-8:", greeting.toString("utf-8"));
console.log("hex:", greeting.toString("hex"));
console.log("base64:", greeting.toString("base64"));

// toJSON
console.log("toJSON:", greeting.toJSON());

// Access single byte
console.log("First byte:", greeting[0], "(H =", "H".charCodeAt(0), ")");
console.log("Byte at 7:", greeting[7], "(N =", "N".charCodeAt(0), ")");

// ──────────────────────────────────────────
// 3. Writing to Buffers
// ──────────────────────────────────────────
console.log("\n--- Writing to Buffers ---");

const writeBuf = Buffer.alloc(20);
writeBuf.write("Hello", 0, "utf-8");
writeBuf.write(" World", 5, "utf-8");
console.log("Written:", writeBuf.toString("utf-8").trim());

// Write integers
const intBuf = Buffer.alloc(8);
intBuf.writeUInt32BE(3000, 0); // Big Endian
intBuf.writeUInt32LE(4000, 4); // Little Endian
console.log("readUInt32BE:", intBuf.readUInt32BE(0)); // 3000
console.log("readUInt32LE:", intBuf.readUInt32LE(4)); // 4000

// ──────────────────────────────────────────
// 4. Buffer Operations
// ──────────────────────────────────────────
console.log("\n--- Buffer Operations ---");

const a = Buffer.from("Hello");
const b = Buffer.from(" World");

// Concatenate
const concatenated = Buffer.concat([a, b]);
console.log("concat:", concatenated.toString());

// Copy
const src = Buffer.from("ABCDE");
const dst = Buffer.alloc(5);
src.copy(dst, 0, 1, 4); // copy B,C,D into dst
console.log("copy:", dst.toString()); // BCD

// Slice (returns view, NOT copy)
const full = Buffer.from("Hello World");
const slice = full.slice(0, 5);
console.log("slice:", slice.toString()); // Hello
// Modifying slice affects original!
slice[0] = 74; // 'J'
console.log("After slice modify, full:", full.toString()); // Jello World

// subarray (same as slice)
const sub = full.subarray(6, 11);
console.log("subarray:", sub.toString());

// Compare
const x = Buffer.from("abc");
const y = Buffer.from("abc");
const z = Buffer.from("xyz");
console.log("equals:", x.equals(y));         // true
console.log("compare:", x.compare(z));        // -1 (x < z)

// ──────────────────────────────────────────
// 5. Encoding Conversions
// ──────────────────────────────────────────
console.log("\n--- Encoding Conversions ---");

const text = "Hello, Node.js! 🚀";

// String → Buffer → Base64
const encoded = Buffer.from(text, "utf-8").toString("base64");
console.log("Base64 encoded:", encoded);

// Base64 → Buffer → String
const decoded = Buffer.from(encoded, "base64").toString("utf-8");
console.log("Base64 decoded:", decoded);

// String → Hex
const hex = Buffer.from(text, "utf-8").toString("hex");
console.log("Hex encoded:", hex.slice(0, 20) + "...");

// Hex → String
const fromHex = Buffer.from(hex, "hex").toString("utf-8");
console.log("Hex decoded:", fromHex);

// ──────────────────────────────────────────
// 6. Buffer & Streams (Real-world usage)
// ──────────────────────────────────────────
console.log("\n--- Buffer with Streams ---");

const { Readable } = require("stream");
const chunks = [];

const stream = Readable.from(["chunk1", " chunk2", " chunk3"]);

stream.on("data", (chunk) => {
    chunks.push(Buffer.from(chunk));
});

stream.on("end", () => {
    const combined = Buffer.concat(chunks);
    console.log("Combined buffer:", combined.toString());
    console.log("Total bytes:", combined.length);
    console.log("\n✅ 06-buffer.js complete!");
});
