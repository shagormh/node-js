/**
 * ============================================
 * 02 - The Factory Pattern
 * ============================================
 * Topics:
 *  - Creating objects without specifying the exact class
 *  - Encapsulating object creation logic
 *  - Common use cases: Different types of users/vehicles/payments
 * ============================================
 */

console.log("=== Factory Pattern Demo ===\n");

// ──────────────────────────────────────────
// The Base "Products"
// ──────────────────────────────────────────
class AdminUser {
    constructor(name) {
        this.name = name;
        this.role = "Admin";
        this.permissions = ["read", "write", "delete", "manage_users"];
    }

    printInfo() {
        console.log(`[${this.role}] ${this.name} - Permissions: ${this.permissions.join(", ")}`);
    }
}

class StandardUser {
    constructor(name) {
        this.name = name;
        this.role = "Standard";
        this.permissions = ["read", "write"];
    }

    printInfo() {
        console.log(`[${this.role}] ${this.name} - Permissions: ${this.permissions.join(", ")}`);
    }
}

class GuestUser {
    constructor(name) {
        this.name = name;
        this.role = "Guest";
        this.permissions = ["read"];
    }

    printInfo() {
        console.log(`[${this.role}] ${this.name} - Permissions: ${this.permissions.join(", ")}`);
    }
}

// ──────────────────────────────────────────
// The Factory Class (The Creator)
// ──────────────────────────────────────────
class UserFactory {
    // Static method to build the right object based on input
    static createUser(name, roleType) {
        switch (roleType.toLowerCase()) {
            case "admin":
                return new AdminUser(name);
            case "standard":
            case "user":
                return new StandardUser(name);
            case "guest":
                return new GuestUser(name);
            default:
                throw new Error(`Unknown role type: ${roleType}`);
        }
    }
}

// ──────────────────────────────────────────
// Usage
// ──────────────────────────────────────────
console.log("Creating users via the Factory...\n");

try {
    const users = [];

    // Notice we don't call `new AdminUser()`, the factory handles the instantiation logic
    users.push(UserFactory.createUser("Alice", "admin"));
    users.push(UserFactory.createUser("Bob", "standard"));
    users.push(UserFactory.createUser("Charlie", "guest"));

    // The client code treats them all uniformly
    users.forEach(user => user.printInfo());

    // Error case
    // UserFactory.createUser("Dave", "superhero");

} catch (err) {
    console.error("Error creating user:", err.message);
}

console.log("\n✅ 02-factory.js complete!");
