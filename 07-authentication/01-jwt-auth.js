/**
 * ============================================
 * 01 - JWT Authentication (JSON Web Tokens)
 * ============================================
 * Topics:
 *  - Signing a token (Login)
 *  - Verifying a token (Protected routes)
 *  - Token expiration and payloads
 * ============================================
 * Note: Requires `npm install jsonwebtoken`
 */

const jwt = require("jsonwebtoken");

console.log("=== JSON Web Tokens (JWT) Demo ===\n");

// IMPORTANT: In production, NEVER hardcode this. Put it in completely secure environment variables (.env)
const JWT_SECRET = "super-secret-key-12345!@#";

// ──────────────────────────────────────────
// 1. Creating (Signing) a Token
// ──────────────────────────────────────────
console.log("--- 1. Signing a Token ---");

// Payload is data you want to store in the token. (Do NOT store passwords!)
const userPayload = {
    id: 42,
    username: "shagor_mh",
    role: "admin"
};

// Sign the token
const token = jwt.sign(
    userPayload,
    JWT_SECRET,
    { expiresIn: "1h" } // expires in 1 hour
);

console.log("Generated Token string:\n", token);
console.log("\nFormat: Base64(Header) . Base64(Payload) . Signature\n");

// ──────────────────────────────────────────
// 2. Verifying a Token
// ──────────────────────────────────────────
console.log("--- 2. Verifying a Token ---");

try {
    // Verify checks the signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token successfully verified!");
    console.log("Decoded Payload:", decoded);
    // Notice `iat` (issued at) and `exp` (expiration) timestamps were added automatically
} catch (error) {
    console.error("❌ Verification failed:", error.message);
}

// ──────────────────────────────────────────
// 3. Common Error Scenarios
// ──────────────────────────────────────────
console.log("\n--- 3. Error Handling ---");

// Scenario A: Wrong Secret
try {
    jwt.verify(token, "wrong-secret-key");
} catch (err) {
    console.log("Wrong Secret Error ->", err.message); // invalid signature
}

// Scenario B: Manipulated Token (User changed their role from 'user' to 'admin' in local storage)
const tamperedToken = token.slice(0, -5) + "abcde";
try {
    jwt.verify(tamperedToken, JWT_SECRET);
} catch (err) {
    console.log("Tampered Token Error ->", err.message); // invalid signature
}

// Scenario C: Expired Token
console.log("\nCreating a token that expires in 1 second...");
const fastExpiringToken = jwt.sign({ data: "test" }, JWT_SECRET, { expiresIn: "1s" });

setTimeout(() => {
    try {
        console.log("Attempting to verify expired token after 1.5s...");
        jwt.verify(fastExpiringToken, JWT_SECRET);
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            console.log("Expected Error -> TokenExpiredError:", err.message);
            console.log("Expired At:", err.expiredAt);
        } else {
            console.log("Other Error:", err.message);
        }
    }
    console.log("\n✅ 01-jwt-auth.js complete!");
}, 1500);
