/**
 * ============================================
 * 01 - MySQL Connection & Basic CRUD
 * ============================================
 * Topics:
 *  - Connecting to MySQL using `mysql2`
 *  - Promises API
 *  - Executing Raw Queries (Prepared Statements)
 * ============================================
 * Note: Requires `npm install mysql2` and a running MySQL server.
 */

const mysql = require("mysql2/promise");

console.log("=== MySQL Connection & CRUD Demo ===\n");

// ──────────────────────────────────────────
// Database Configuration
// ──────────────────────────────────────────
const dbConfig = {
    host: "localhost",
    user: "root",       // Update with your MySQL username
    password: "password", // Update with your MySQL password
    // database: 'nodejs_learning' // We'll create this dynamically below
};

async function runMySQLDemo() {
    let connection;

    try {
        // 1. Initial connection without database selected to create it
        console.log("⏳ Connecting to MySQL...");
        connection = await mysql.createConnection(dbConfig);
        console.log("✅ connected to MySQL server.");

        // 2. Create Database & Table
        console.log("\n--- Setup ---");
        await connection.query("CREATE DATABASE IF NOT EXISTS nodejs_learning");
        await connection.query("USE nodejs_learning");
        console.log("✅ Selected database 'nodejs_learning'.");

        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        await connection.query(createTableQuery);
        console.log("✅ Users table ensured.");

        // Clear existing for clean demo
        await connection.query("TRUNCATE TABLE users");

        // ──────────────────────────────────────────
        // 3. CRUD Operations
        // ──────────────────────────────────────────

        // CREATE (Using Prepared Statements to prevent SQL Injection)
        console.log("\n--- Create ---");
        const insertQuery = "INSERT INTO users (name, email) VALUES (?, ?)";
        const [insertResult] = await connection.execute(insertQuery, ["Alice Smith", "alice@example.com"]);
        console.log(`Inserted Alice (ID: ${insertResult.insertId})`);

        await connection.execute(insertQuery, ["Bob Jones", "bob@example.com"]);
        console.log("Inserted Bob.");

        // READ
        console.log("\n--- Read ---");
        // .query() can be used for simple fetches without params
        const [rows, fields] = await connection.query("SELECT * FROM users");
        console.log("All Users:");
        console.table(rows);

        // Read single with param
        const [aliceRows] = await connection.execute("SELECT name, email FROM users WHERE email = ?", ["alice@example.com"]);
        console.log("Found:", aliceRows[0]);

        // UPDATE
        console.log("\n--- Update ---");
        const updateQuery = "UPDATE users SET name = ? WHERE email = ?";
        const [updateResult] = await connection.execute(updateQuery, ["Alice Updated", "alice@example.com"]);
        console.log(`Rows updated: ${updateResult.affectedRows}`);

        // DELETE
        console.log("\n--- Delete ---");
        const deleteQuery = "DELETE FROM users WHERE email = ?";
        const [deleteResult] = await connection.execute(deleteQuery, ["bob@example.com"]);
        console.log(`Rows deleted: ${deleteResult.affectedRows}`);

        // Final verify
        const [finalRows] = await connection.query("SELECT id, name FROM users");
        console.log("\nRemaining Users:", finalRows);

    } catch (err) {
        if (err.code === 'ECONNREFUSED') {
            console.log("❌ Connection refused. Is MySQL running on localhost:3306?");
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log("❌ Access Denied. Please check your MySQL username/password in the script.");
        } else {
            console.error("❌ SQL Error:", err.message);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log("\n✅ Database connection closed. 01-connect.js (MySQL) complete!");
        }
    }
}

// Start Demo
runMySQLDemo();
