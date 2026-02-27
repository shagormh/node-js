/**
 * ============================================
 * 01 - The Singleton Pattern
 * ============================================
 * Topics:
 *  - Ensuring a class has only one instance
 *  - Providing a global point of access
 *  - Common use cases: Database connections, Loggers, Configuration managers
 * ============================================
 */

console.log("=== Singleton Pattern Demo ===\n");

class DatabaseConnection {
    constructor() {
        // Prevent direct instantiation (since JS lacks private constructors natively)
        if (DatabaseConnection.instance) {
            throw new Error("Cannot define multiple database connections! Use DatabaseConnection.getInstance()");
        }

        this.connectionString = "mongodb://localhost:27017/my_app";
        this.isConnected = false;
        this.queryCount = 0;

        console.log("--> New DatabaseConnection created. <--");
    }

    // The key to the Singleton pattern
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    connect() {
        if (!this.isConnected) {
            console.log(`Connecting to ${this.connectionString}...`);
            this.isConnected = true;
            console.log("Connected successfully.");
        } else {
            console.log("Already connected.");
        }
    }

    query(sql) {
        if (!this.isConnected) throw new Error("Not connected to DB!");
        this.queryCount++;
        console.log(`Executing Query #${this.queryCount}: ${sql}`);
    }
}

// ──────────────────────────────────────────
// Usage
// ──────────────────────────────────────────

try {
    // Usage 1: Get the instance
    const db1 = DatabaseConnection.getInstance();
    db1.connect();
    db1.query("SELECT * FROM users"); // Query #1

    // Usage 2: Get the instance again from elsewhere in the app
    console.log("\nGetting another reference to the DB...");
    const db2 = DatabaseConnection.getInstance();
    db2.query("SELECT * FROM products"); // Query #2

    // Proof that they are the exact same object
    console.log("\nAre db1 and db2 the exact same instance?", db1 === db2);
    console.log(`Total queries executed across all references: ${db2.queryCount}`);

    // Usage 3: Preventing multiple creations
    console.log("\nAttempting to incorrectly create a new instance using 'new'...");
    const db3 = new DatabaseConnection(); // Throws error!

} catch (err) {
    console.error("Error caught:", err.message);
    console.log("\n✅ 01-singleton.js complete!");
}

/*
Note on Node.js Modules and Singletons:
In Node.js, `require()` caches the exported object.
Often, just exporting an instance of a class acts as a singleton:

  // db.js
  class Database { ... }
  module.exports = new Database(); // Singleton by module caching
*/
