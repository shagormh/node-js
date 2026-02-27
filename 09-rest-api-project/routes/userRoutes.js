// ============================================
// routes/userRoutes.js - API Routing
// ============================================

const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// Defined routes mapped to controllers
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes using the auth middleware
router.get("/profile", protect, getUserProfile);

module.exports = router;
