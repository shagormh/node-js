/**
 * ============================================
 * 03 - Async/Await in Node.js
 * ============================================
 * Topics:
 *  - async function basics
 *  - await keyword
 *  - try/catch with async/await
 *  - Parallel execution
 *  - Sequential vs parallel
 *  - Async iteration (for await...of)
 *  - Async class methods
 *  - Top-level await (ESM)
 * ============================================
 */

console.log("=== Async/Await in Node.js ===\n");

// ──────────────────────────────────────────
// Helper: Simulate async DB/API operations
// ──────────────────────────────────────────
function delay(ms, value, shouldFail = false) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (shouldFail) reject(new Error(`Operation failed for: ${value}`));
            else resolve(value);
        }, ms)
    );
}

// ──────────────────────────────────────────
// 1. Basic Async/Await
// ──────────────────────────────────────────
console.log("--- Basic Async/Await ---");

async function fetchUser(id) {
    const user = await delay(50, { id, name: "Alice", email: "alice@example.com" });
    return user;
}

async function main() {
    const user = await fetchUser(1);
    console.log("Fetched user:", user);
}
main();

// ──────────────────────────────────────────
// 2. try/catch Error Handling
// ──────────────────────────────────────────
async function handleErrors() {
    console.log("\n--- try/catch with async ---");

    try {
        const result = await delay(50, "ok");
        console.log("Success:", result);

        await delay(50, null, true); // will throw
    } catch (err) {
        console.error("Caught error:", err.message);
    } finally {
        console.log("Finally block runs");
    }
}
setTimeout(() => handleErrors(), 100);

// ──────────────────────────────────────────
// 3. Sequential vs Parallel Execution
// ──────────────────────────────────────────
async function sequential() {
    console.log("\n--- Sequential Execution ---");
    console.time("sequential");
    const a = await delay(100, "A");
    const b = await delay(100, "B");
    const c = await delay(100, "C");
    console.timeEnd("sequential"); // ~300ms
    console.log("Sequential results:", a, b, c);
}

async function parallel() {
    console.log("\n--- Parallel Execution ---");
    console.time("parallel");
    const [a, b, c] = await Promise.all([
        delay(100, "A"),
        delay(100, "B"),
        delay(100, "C"),
    ]);
    console.timeEnd("parallel"); // ~100ms
    console.log("Parallel results:", a, b, c);
}

setTimeout(() => sequential().then(() => parallel()), 300);

// ──────────────────────────────────────────
// 4. Async Iteration (for await...of)
// ──────────────────────────────────────────
async function* asyncGenerator() {
    yield await delay(50, "Item 1");
    yield await delay(50, "Item 2");
    yield await delay(50, "Item 3");
}

async function consumeGenerator() {
    console.log("\n--- Async Iteration (for await...of) ---");
    for await (const item of asyncGenerator()) {
        console.log("Received:", item);
    }
    console.log("Generator complete");
}
setTimeout(() => consumeGenerator(), 900);

// ──────────────────────────────────────────
// 5. Real-world: Async CRUD Service
// ──────────────────────────────────────────
class UserService {
    #db = new Map();
    #nextId = 1;

    async create(userData) {
        await delay(20, null); // simulate DB write
        const user = { id: this.#nextId++, ...userData, createdAt: new Date() };
        this.#db.set(user.id, user);
        return user;
    }

    async findById(id) {
        await delay(20, null);
        const user = this.#db.get(id);
        if (!user) throw new Error(`User ${id} not found`);
        return user;
    }

    async findAll() {
        await delay(20, null);
        return [...this.#db.values()];
    }

    async update(id, updates) {
        await delay(20, null);
        const user = this.#db.get(id);
        if (!user) throw new Error(`User ${id} not found`);
        const updated = { ...user, ...updates, updatedAt: new Date() };
        this.#db.set(id, updated);
        return updated;
    }

    async delete(id) {
        await delay(20, null);
        if (!this.#db.has(id)) throw new Error(`User ${id} not found`);
        this.#db.delete(id);
        return true;
    }
}

async function demoCRUD() {
    console.log("\n--- Async CRUD Service Demo ---");
    const service = new UserService();

    // Create multiple users in parallel
    const [alice, bob] = await Promise.all([
        service.create({ name: "Alice", email: "alice@example.com" }),
        service.create({ name: "Bob", email: "bob@example.com" }),
    ]);
    console.log("Created:", alice.name, "and", bob.name);

    // Find all
    const all = await service.findAll();
    console.log("All users:", all.length);

    // Update
    const updated = await service.update(alice.id, { name: "Alice Smith" });
    console.log("Updated:", updated.name);

    // Delete
    await service.delete(bob.id);
    const remaining = await service.findAll();
    console.log("After delete:", remaining.length);

    // Error handling
    try {
        await service.findById(99);
    } catch (err) {
        console.log("Expected error:", err.message);
    }
}
setTimeout(() => demoCRUD(), 1200);

// ──────────────────────────────────────────
// 6. Async with Retries
// ──────────────────────────────────────────
async function withRetry(asyncFn, retries = 3, delayMs = 50) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await asyncFn();
        } catch (err) {
            if (attempt === retries) throw err;
            console.log(`  Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
            await delay(delayMs, null);
        }
    }
}

setTimeout(async () => {
    console.log("\n--- Async with Retries ---");
    let callCount = 0;

    const unstableFn = () => {
        callCount++;
        if (callCount < 3) return delay(10, null, true); // fail first 2 times
        return delay(10, "finally succeeded!");
    };

    try {
        const result = await withRetry(unstableFn, 3, 20);
        console.log("Result after retries:", result);
    } catch (err) {
        console.error("All retries failed:", err.message);
    }

    console.log("\n✅ 03-async-await.js complete!");
}, 1800);
