/**
 * ============================================
 * 02 - Bcrypt Password Hashing
 * ============================================
 * Topics:
 *  - Hashing a raw password (during Sign Up)
 *  - Comparing a raw password with a hash (during Login)
 *  - Understanding 'Salts'
 * ============================================
 * Note: Requires `npm install bcryptjs` (bcryptjs is pure JS, bcrypt uses C++ bindings)
 */

const bcrypt = require("bcryptjs");

console.log("=== Bcrypt Password Hashing Demo ===\n");

const plainPassword = "mySuperSecretPassword123";

async function runBcryptDemo() {
    try {
        // ──────────────────────────────────────────
        // 1. Hashing (Registration Flow)
        // ──────────────────────────────────────────
        console.log("--- 1. Registration (Hashing) ---");

        // "Cost factor" or "Rounds" (usually 10-12). Higher = slower/more secure.
        const saltRounds = 10;

        console.log(`Generating salt & hashing password... (Cost: ${saltRounds})`);
        console.time("Hashing Time");

        // Option A: Auto-gen salt and hash in one function (Most common)
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        console.timeEnd("Hashing Time");
        console.log("\nOriginal Password :", plainPassword);
        console.log("Hashed Password   :", hashedPassword);
        console.log("\nNotice the components of the hash:");
        console.log("  Algorithm  :", hashedPassword.slice(0, 3));      // $2a$ or $2b$
        console.log("  Cost Factor:", hashedPassword.slice(3, 6));      // $10$
        console.log("  Salt       :", hashedPassword.slice(6, 28));     // 22 chars
        console.log("  Hash       :", hashedPassword.slice(28));        // 31 chars

        // ──────────────────────────────────────────
        // 2. Comparing (Login Flow)
        // ──────────────────────────────────────────
        console.log("\n--- 2. Login (Comparing) ---");

        const validLoginAttempt = "mySuperSecretPassword123";
        const invalidLoginAttempt = "wrongpassword";

        console.log(`Checking valid attempt ("${validLoginAttempt}")...`);
        // Compare takes raw password + DB hash. It extracts the salt from the hash,
        // hashes the attempt, and compares the two safely to prevent timing attacks.
        const isMatch = await bcrypt.compare(validLoginAttempt, hashedPassword);
        console.log(`Match? ${isMatch ? "✅ Yes" : "❌ No"}`);

        console.log(`\nChecking invalid attempt ("${invalidLoginAttempt}")...`);
        const isMatch2 = await bcrypt.compare(invalidLoginAttempt, hashedPassword);
        console.log(`Match? ${isMatch2 ? "✅ Yes" : "❌ No"}`);

        // ──────────────────────────────────────────
        // 3. Why Salts Matter
        // ──────────────────────────────────────────
        console.log("\n--- 3. Identical Passwords, Different Hashes ---");
        // Hashing the exact same password again generates a completely different hash string
        // because a new random salt is generated every single time.
        const hash2 = await bcrypt.hash(plainPassword, saltRounds);

        console.log("Hash 1:", hashedPassword);
        console.log("Hash 2:", hash2);
        console.log("Are hashes equal string-to-string?", hashedPassword === hash2 ? "Yes" : "No, thanks to random salts!");

        console.log("\n✅ 02-bcrypt-passwords.js complete!");

    } catch (err) {
        console.error("Error during bcrypt operations:", err);
    }
}

runBcryptDemo();
