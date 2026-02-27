/**
 * ============================================
 * 01 - Unit Test Example (Jest framework)
 * ============================================
 * Topics:
 *  - Describe blocks, test cases (it)
 *  - Assertions (expect)
 *  - Testing synchronous functions
 *  - Testing asynchronous functions
 * ============================================
 * Note: Run this with `npm test` after installing Jest
 */

// ──────────────────────────────────────────
// Functions to test (In real life, these are in another file)
// ──────────────────────────────────────────
const sum = (a, b) => a + b;

const getUser = async (id) => {
    if (id <= 0) throw new Error("Invalid ID");
    return { id, name: "Alice", status: "active" };
};

// ──────────────────────────────────────────
// Tests Definition
// ──────────────────────────────────────────

describe("Math Utility Functions", () => {
    it("should add two positive numbers correctly", () => {
        const result = sum(2, 3);
        // Assertion
        expect(result).toBe(5);
    });

    it("should handle negative numbers", () => {
        expect(sum(-5, 10)).toBe(5);
    });
});

describe("User Service (Async)", () => {
    it("should return a user object for a valid ID", async () => {
        // Testing resolving promises
        const user = await getUser(1);

        // Assertions
        expect(user).toBeDefined();
        expect(user.id).toBe(1);
        expect(user.name).toBe("Alice");
        // Checking object properties
        expect(user).toHaveProperty("status", "active");
    });

    it("should throw an error for invalid IDs", async () => {
        // Testing rejecting promises
        await expect(getUser(-1)).rejects.toThrow("Invalid ID");
    });
});
