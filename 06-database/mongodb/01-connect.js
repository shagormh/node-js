/**
 * ============================================
 * 06 - Database Integration (MongoDB via Mongoose)
 * ============================================
 * Topics:
 *  - Connecting to MongoDB using Mongoose
 *  - Defining a Schema and Model
 *  - Basic CRUD Operations
 * ============================================
 * Note: Requires `npm install mongoose` and a running MongoDB instance.
 */

const mongoose = require("mongoose");

// Connection string (Update if not using localhost default)
const MONGO_URI = "mongodb://localhost:27017/nodejs_learning_db";

console.log("=== MongoDB / Mongoose Demo ===\n");

// ──────────────────────────────────────────
// 1. Connect to MongoDB
// ──────────────────────────────────────────
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Successfully connected to MongoDB.");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

// ──────────────────────────────────────────
// 2. Define Schema & Model
// ──────────────────────────────────────────
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    age: {
        type: Number,
        min: 0,
        default: 18
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // automatically adds `createdAt` and `updatedAt`

const User = mongoose.model("User", userSchema);


// ──────────────────────────────────────────
// 3. CRUD Operations Example
// ──────────────────────────────────────────
async function runDemo() {
    await connectDB();

    try {
        // Clear existing data for a clean demo
        await User.deleteMany({});
        console.log("🧹 Cleared existing users.");

        // CREATE
        console.log("\n--- Create ---");
        const u1 = await User.create({ name: "Alice", email: "alice@example.com", age: 25 });
        const u2 = await User.create({ name: "Bob", email: "bob@example.com", age: 30 });
        console.log(`Created: ${u1.name} & ${u2.name}`);

        // READ
        console.log("\n--- Read ---");
        const allUsers = await User.find({});
        console.log(`Found ${allUsers.length} users.`);

        const singleUser = await User.findOne({ email: "alice@example.com" });
        console.log(`Found one: ${singleUser.name} (Age: ${singleUser.age})`);

        // UPDATE
        console.log("\n--- Update ---");
        const updatedUser = await User.findByIdAndUpdate(
            u1._id,
            { age: 26 },
            { new: true } // Returns the modified document rather than the original
        );
        console.log(`Updated ${updatedUser.name}'s age to ${updatedUser.age}.`);

        // DELETE
        console.log("\n--- Delete ---");
        const deletedUser = await User.findByIdAndDelete(u2._id);
        console.log(`Deleted user: ${deletedUser.name}.`);

        const finalUsers = await User.find({});
        console.log(`Users remaining: ${finalUsers.length}`);

    } catch (err) {
        console.error("Error during operations:", err.message);
    } finally {
        // Close the connection when done
        mongoose.connection.close();
        console.log("\n✅ Database connection closed. 01-connect.js complete!");
    }
}

// Start demo
runDemo();
