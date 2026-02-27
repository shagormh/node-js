/**
 * ============================================
 * 07 - crypto Module
 * ============================================
 * Built-in module for cryptographic operations
 * No installation needed - require('crypto')
 * ============================================
 */

const crypto = require("crypto");

console.log("=== crypto Module ===\n");

// ──────────────────────────────────────────
// 1. Hashing (one-way)
// ──────────────────────────────────────────
console.log("--- Hashing ---");

const data = "Hello, World!";

// MD5 (not for security, just checksums)
const md5 = crypto.createHash("md5").update(data).digest("hex");
console.log("MD5:", md5);

// SHA-256 (secure)
const sha256 = crypto.createHash("sha256").update(data).digest("hex");
console.log("SHA-256:", sha256);

// SHA-512
const sha512 = crypto.createHash("sha512").update(data).digest("hex");
console.log("SHA-512:", sha512.slice(0, 40) + "...");

// base64 output
const sha256Base64 = crypto.createHash("sha256").update(data).digest("base64");
console.log("SHA-256 (base64):", sha256Base64);

// Chaining updates (useful for large data/streams)
const hash = crypto.createHash("sha256");
hash.update("Hello, ");
hash.update("World!");
console.log("Chained update:", hash.digest("hex"));

// ──────────────────────────────────────────
// 2. HMAC (Hash-based Message Authentication Code)
// ──────────────────────────────────────────
console.log("\n--- HMAC ---");

const secret = "my-secret-key";
const message = "This is a signed message";

const hmac = crypto.createHmac("sha256", secret).update(message).digest("hex");
console.log("HMAC-SHA256:", hmac);

// Verify HMAC
function verifyHmac(msg, receivedHmac, key) {
    const expected = crypto.createHmac("sha256", key).update(msg).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedHmac));
}
console.log("HMAC valid:", verifyHmac(message, hmac, secret)); // true
console.log("HMAC invalid:", verifyHmac(message, "fakemac---000000000000000000000000000000000000000000000000000000000000", secret)); // false

// ──────────────────────────────────────────
// 3. Random Bytes & UUID
// ──────────────────────────────────────────
console.log("\n--- Random Bytes & UUID ---");

// Random bytes
const randomBytes = crypto.randomBytes(16);
console.log("Random bytes (hex):", randomBytes.toString("hex"));
console.log("Random bytes (base64):", randomBytes.toString("base64"));

// Random UUID (Node 14.17+)
const uuid = crypto.randomUUID();
console.log("Random UUID:", uuid);

// Random int in range
const randomInt = crypto.randomInt(1, 100);
console.log("Random int (1-99):", randomInt);

// ──────────────────────────────────────────
// 4. Symmetric Encryption (AES-256-GCM)
// ──────────────────────────────────────────
console.log("\n--- AES-256-GCM Encryption ---");

function encrypt(plaintext, key) {
    const iv = crypto.randomBytes(12); // 12 bytes for GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf-8"),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag(); // GCM authentication tag

    return {
        encrypted: encrypted.toString("hex"),
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
    };
}

function decrypt({ encrypted, iv, authTag }, key) {
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, "hex")),
        decipher.final(),
    ]);

    return decrypted.toString("utf-8");
}

// Key must be 32 bytes for AES-256
const aesKey = crypto.randomBytes(32);
const plaintext = "Secret message: Hello, Crypto!";

const encResult = encrypt(plaintext, aesKey);
console.log("Encrypted:", encResult.encrypted);
console.log("IV:", encResult.iv);

const decrypted = decrypt(encResult, aesKey);
console.log("Decrypted:", decrypted);

// ──────────────────────────────────────────
// 5. Key Derivation (PBKDF2 - for passwords)
// ──────────────────────────────────────────
console.log("\n--- Key Derivation (PBKDF2) ---");

function deriveKey(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 100000, 32, "sha512", (err, key) => {
            if (err) reject(err);
            else resolve(key.toString("hex"));
        });
    });
}

const salt = crypto.randomBytes(16);
deriveKey("myPassword123", salt).then((key) => {
    console.log("Derived key (hex):", key.slice(0, 32) + "...");
});

// ──────────────────────────────────────────
// 6. RSA Key Generation (Asymmetric)
// ──────────────────────────────────────────
console.log("\n--- RSA Key Pair ---");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

console.log("Public Key (first line):", publicKey.split("\n")[0]);
console.log("Private Key (first line):", privateKey.split("\n")[0]);

// RSA Encrypt & Decrypt
const rsaMessage = "RSA Encrypted Message";
const rsaEncrypted = crypto.publicEncrypt(publicKey, Buffer.from(rsaMessage));
console.log("RSA Encrypted (base64):", rsaEncrypted.toString("base64").slice(0, 40) + "...");

const rsaDecrypted = crypto.privateDecrypt(privateKey, rsaEncrypted);
console.log("RSA Decrypted:", rsaDecrypted.toString());

console.log("\n✅ 07-crypto-module.js complete!");
