/**
 * ============================================
 * 02 - os Module
 * ============================================
 * Built-in module for Operating System info
 * ============================================
 */

const os = require("os");

console.log("=== os Module ===\n");

// ──────────────────────────────────────────
// 1. System Information
// ──────────────────────────────────────────
console.log("--- System Info ---");
console.log("Platform:", os.platform());       // linux, darwin, win32
console.log("OS Type:", os.type());            // Linux, Darwin, Windows_NT
console.log("OS Release:", os.release());      // kernel version
console.log("Architecture:", os.arch());       // x64, arm64, etc.
console.log("Hostname:", os.hostname());       // machine name
console.log("Home Directory:", os.homedir());  // /home/username
console.log("Temp Directory:", os.tmpdir());   // /tmp

// ──────────────────────────────────────────
// 2. Memory Information
// ──────────────────────────────────────────
console.log("\n--- Memory ---");
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;

const toGB = (bytes) => (bytes / 1024 ** 3).toFixed(2) + " GB";

console.log("Total Memory:", toGB(totalMem));
console.log("Free Memory:", toGB(freeMem));
console.log("Used Memory:", toGB(usedMem));
console.log("Usage %:", ((usedMem / totalMem) * 100).toFixed(1) + "%");

// ──────────────────────────────────────────
// 3. CPU Information
// ──────────────────────────────────────────
console.log("\n--- CPUs ---");
const cpus = os.cpus();
console.log("CPU Count:", cpus.length);
console.log("CPU Model:", cpus[0].model);
console.log("CPU Speed:", cpus[0].speed + " MHz");

// CPU load per core
cpus.forEach((cpu, i) => {
    const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
    const idle = cpu.times.idle;
    const usage = (((total - idle) / total) * 100).toFixed(1);
    console.log(`  Core ${i}: ${usage}% used`);
});

// ──────────────────────────────────────────
// 4. Network Interfaces
// ──────────────────────────────────────────
console.log("\n--- Network Interfaces ---");
const interfaces = os.networkInterfaces();
for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
        if (addr.family === "IPv4") {
            console.log(`  ${name}: ${addr.address} (${addr.internal ? "internal" : "external"})`);
        }
    }
}

// ──────────────────────────────────────────
// 5. Uptime
// ──────────────────────────────────────────
console.log("\n--- Uptime ---");
const uptimeSec = os.uptime();
const hours = Math.floor(uptimeSec / 3600);
const minutes = Math.floor((uptimeSec % 3600) / 60);
console.log(`System uptime: ${hours}h ${minutes}m`);
console.log(`Process uptime: ${process.uptime().toFixed(2)}s`);

// ──────────────────────────────────────────
// 6. Load Average (Linux/Mac only)
// ──────────────────────────────────────────
console.log("\n--- Load Average ---");
const load = os.loadavg();
console.log(`1 min: ${load[0].toFixed(2)},  5 min: ${load[1].toFixed(2)},  15 min: ${load[2].toFixed(2)}`);

// ──────────────────────────────────────────
// 7. OS Constants
// ──────────────────────────────────────────
console.log("\n--- OS Constants ---");
console.log("EOL (end of line):", JSON.stringify(os.EOL)); // '\n' on Linux, '\r\n' on Windows
console.log("Priority: PRIORITY_LOW:", os.constants.priority.PRIORITY_LOW);

// ──────────────────────────────────────────
// 8. User Info
// ──────────────────────────────────────────
console.log("\n--- User Info ---");
const userInfo = os.userInfo();
console.log("Username:", userInfo.username);
console.log("Home dir:", userInfo.homedir);
console.log("Shell:", userInfo.shell);

console.log("\n✅ 02-os-module.js complete!");
