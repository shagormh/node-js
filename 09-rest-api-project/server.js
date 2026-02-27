// ============================================
// 09-rest-api-project/server.js
// ============================================
// Entry point for the REST API project
// Run with: node server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Keep environment variables in a .env file typically
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/rest_api_demo";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in parsing

// Import Routes
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send(`
    <h2>Node.js Basic to Advanced -> Complete REST API Demo</h2>
    <p>Available endpoints:</p>
    <ul>
      <li>POST /api/users/register (Register new user)</li>
      <li>POST /api/users/login (Authenticate user)</li>
      <li>GET  /api/users/profile (Protected, requires JWT Bearer Token)</li>
    </ul>
  `);
});

// Database connection
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ connected to MongoDB (REST API Project)");
        // Start Server
        app.listen(PORT, () => {
            console.log(`🚀 REST API Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
    });
