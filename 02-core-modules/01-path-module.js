/**
 * ============================================
 * 01 - path Module
 * ============================================
 * Built-in module for file & directory path handling
 * No installation needed - require('path')
 * ============================================
 */

const path = require("path");

console.log("=== path Module ===\n");

// ──────────────────────────────────────────
// 1. Basic Properties
// ──────────────────────────────────────────
console.log("__dirname:", __dirname);
console.log("__filename:", __filename);
console.log();

// ──────────────────────────────────────────
// 2. path.basename()
// ──────────────────────────────────────────
console.log("--- path.basename ---");
console.log(path.basename("/home/user/docs/file.txt"));       // file.txt
console.log(path.basename("/home/user/docs/file.txt", ".txt")); // file
console.log(path.basename(__filename));                         // 01-path-module.js

// ──────────────────────────────────────────
// 3. path.dirname()
// ──────────────────────────────────────────
console.log("\n--- path.dirname ---");
console.log(path.dirname("/home/user/docs/file.txt")); // /home/user/docs
console.log(path.dirname(__filename));                 // current folder

// ──────────────────────────────────────────
// 4. path.extname()
// ──────────────────────────────────────────
console.log("\n--- path.extname ---");
console.log(path.extname("index.html"));   // .html
console.log(path.extname("server.js"));    // .js
console.log(path.extname("README.md"));    // .md
console.log(path.extname("archive.tar.gz")); // .gz

// ──────────────────────────────────────────
// 5. path.join() - cross-platform joining
// ──────────────────────────────────────────
console.log("\n--- path.join ---");
const joined = path.join("/home", "user", "documents", "file.txt");
console.log(joined); // /home/user/documents/file.txt

const joined2 = path.join(__dirname, "..", "02-core-modules", "sample.txt");
console.log(joined2);

// Handles extra slashes
console.log(path.join("/foo/", "/bar", "//baz")); // /foo/bar/baz

// ──────────────────────────────────────────
// 6. path.resolve() - absolute path
// ──────────────────────────────────────────
console.log("\n--- path.resolve ---");
console.log(path.resolve("file.txt"));             // absolute path from cwd
console.log(path.resolve("/tmp", "uploads", "img.png")); // /tmp/uploads/img.png
console.log(path.resolve("/a", "/b"));             // /b (absolute wins)

// ──────────────────────────────────────────
// 7. path.parse() & path.format()
// ──────────────────────────────────────────
console.log("\n--- path.parse ---");
const parsed = path.parse("/home/user/docs/file.txt");
console.log(parsed);
// {
//   root: '/',
//   dir: '/home/user/docs',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

console.log("\n--- path.format ---");
const formatted = path.format({
    dir: "/home/user/docs",
    name: "report",
    ext: ".pdf",
});
console.log(formatted); // /home/user/docs/report.pdf

// ──────────────────────────────────────────
// 8. path.relative()
// ──────────────────────────────────────────
console.log("\n--- path.relative ---");
console.log(path.relative("/home/user", "/home/user/docs/file.txt")); // docs/file.txt
console.log(path.relative("/data/downloads", "/data/uploads/img.png")); // ../uploads/img.png

// ──────────────────────────────────────────
// 9. path.normalize()
// ──────────────────────────────────────────
console.log("\n--- path.normalize ---");
console.log(path.normalize("/home//user/../user/./docs")); // /home/user/docs

// ──────────────────────────────────────────
// 10. path.sep & path.delimiter
// ──────────────────────────────────────────
console.log("\n--- path.sep & path.delimiter ---");
console.log("Separator:", JSON.stringify(path.sep));       // "/" on Linux/Mac
console.log("Delimiter:", JSON.stringify(path.delimiter)); // ":" on Linux/Mac, ";" on Windows
console.log("posix:", !!path.posix);   // true
console.log("win32:", !!path.win32);   // true

console.log("\n✅ 01-path-module.js complete!");
