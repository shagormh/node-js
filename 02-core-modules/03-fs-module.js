/**
 * ============================================
 * 03 - fs (File System) Module
 * ============================================
 * Topics:
 *  - Synchronous file operations
 *  - Asynchronous (callback) file operations
 *  - Promise-based (fs/promises) file operations
 *  - Directories
 *  - File stats & watching
 * ============================================
 */

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Working directory for demo files
const DEMO_DIR = path.join(__dirname, "fs-demo");

// ──────────────────────────────────────────
// Setup demo directory
// ──────────────────────────────────────────
if (!fs.existsSync(DEMO_DIR)) {
    fs.mkdirSync(DEMO_DIR, { recursive: true });
}

// ──────────────────────────────────────────
// 1. Synchronous Operations
// ──────────────────────────────────────────
console.log("=== Synchronous File Operations ===");

const syncFile = path.join(DEMO_DIR, "sync-file.txt");

// Write (sync)
fs.writeFileSync(syncFile, "Hello from Node.js!\nThis is line 2.\nLine 3.");
console.log("✅ File written (sync)");

// Read (sync)
const syncContent = fs.readFileSync(syncFile, "utf-8");
console.log("Read content:\n", syncContent);

// Append (sync)
fs.appendFileSync(syncFile, "\nAppended line");
console.log("✅ File appended (sync)");

// File exists
console.log("File exists:", fs.existsSync(syncFile));

// File stats
const stats = fs.statSync(syncFile);
console.log("File size:", stats.size, "bytes");
console.log("Is file:", stats.isFile());
console.log("Is directory:", stats.isDirectory());
console.log("Created:", stats.birthtime.toLocaleDateString());

// ──────────────────────────────────────────
// 2. Asynchronous Operations (Callbacks)
// ──────────────────────────────────────────
console.log("\n=== Asynchronous (Callback) Operations ===");

const asyncFile = path.join(DEMO_DIR, "async-file.txt");

// Write async
fs.writeFile(asyncFile, "Async file content", "utf-8", (err) => {
    if (err) return console.error("Write error:", err.message);
    console.log("✅ File written (async)");

    // Read async - nested in write callback
    fs.readFile(asyncFile, "utf-8", (err2, data) => {
        if (err2) return console.error("Read error:", err2.message);
        console.log("Async read:", data);

        // Rename async
        const renamedFile = path.join(DEMO_DIR, "renamed-async.txt");
        fs.rename(asyncFile, renamedFile, (err3) => {
            if (err3) return console.error("Rename error:", err3.message);
            console.log("✅ File renamed (async)");
        });
    });
});

// ──────────────────────────────────────────
// 3. Promise-based Operations (Modern)
// ──────────────────────────────────────────
async function promiseFileOps() {
    console.log("\n=== Promise-based (fs/promises) Operations ===");

    const promiseFile = path.join(DEMO_DIR, "promise-file.txt");

    try {
        // Write
        await fsPromises.writeFile(promiseFile, "Promise-based file content\nLine 2\nLine 3");
        console.log("✅ File written (promise)");

        // Read
        const data = await fsPromises.readFile(promiseFile, "utf-8");
        console.log("File content:", data);

        // Append
        await fsPromises.appendFile(promiseFile, "\nAppended with promises");
        console.log("✅ File appended (promise)");

        // File stats
        const stat = await fsPromises.stat(promiseFile);
        console.log("File size:", stat.size, "bytes");

        // Copy file
        const copyFile = path.join(DEMO_DIR, "promise-file-copy.txt");
        await fsPromises.copyFile(promiseFile, copyFile);
        console.log("✅ File copied");

        // ──────────────────────────────────────
        // 4. Directory Operations
        // ──────────────────────────────────────
        console.log("\n=== Directory Operations ===");

        const subDir = path.join(DEMO_DIR, "subdir", "nested");
        await fsPromises.mkdir(subDir, { recursive: true });
        console.log("✅ Directories created (recursive)");

        // Write a file inside
        await fsPromises.writeFile(path.join(subDir, "nested.txt"), "Nested file!");

        // Read directory
        const files = await fsPromises.readdir(DEMO_DIR);
        console.log("Files in demo dir:", files);

        // Recursive readdir (Node 18.17+)
        const allFiles = await fsPromises.readdir(DEMO_DIR, { recursive: true });
        console.log("All files (recursive):", allFiles);

        // ──────────────────────────────────────
        // 5. JSON Read/Write (very common pattern)
        // ──────────────────────────────────────
        console.log("\n=== JSON File Operations ===");

        const jsonFile = path.join(DEMO_DIR, "data.json");
        const userData = {
            users: [
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" },
            ],
        };

        // Write JSON
        await fsPromises.writeFile(jsonFile, JSON.stringify(userData, null, 2));
        console.log("✅ JSON written");

        // Read JSON
        const jsonContent = await fsPromises.readFile(jsonFile, "utf-8");
        const parsedData = JSON.parse(jsonContent);
        console.log("JSON data:", parsedData.users[0]);

        // ──────────────────────────────────────
        // 6. File Watching
        // ──────────────────────────────────────
        console.log("\n=== File Watching ===");
        const watchTarget = path.join(DEMO_DIR, "watched.txt");
        await fsPromises.writeFile(watchTarget, "Initial content");

        const watcher = fs.watch(watchTarget, (event, filename) => {
            console.log(`File event: ${event} on ${filename}`);
        });

        // Trigger change
        setTimeout(async () => {
            await fsPromises.writeFile(watchTarget, "Modified content");
        }, 100);

        // Stop watching after 500ms
        setTimeout(() => {
            watcher.close();
            console.log("✅ Watcher closed");
            cleanup();
        }, 500);

    } catch (err) {
        console.error("Error:", err.message);
    }
}

// Cleanup demo files (optional)
async function cleanup() {
    try {
        await fsPromises.rm(DEMO_DIR, { recursive: true, force: true });
        console.log("\n✅ Demo files cleaned up");
        console.log("\n✅ 03-fs-module.js complete!");
    } catch { }
}

promiseFileOps();
