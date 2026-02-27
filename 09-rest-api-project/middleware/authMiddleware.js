// ============================================
// middleware/authMiddleware.js - Protection
// ============================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "rest-api-super-secret-key!!";

const protect = async (req, res, next) => {
    let token;

    // Check if header contains Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header string "Bearer <token>"
            token = req.headers.authorization.split(" ")[1];

            // Decode and Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Fetch user from DB and attach to req object (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            next(); // Proceed to the protected route handler
        } catch (error) {
            console.error(error);
            res.status(401).json({ error: "Not authorized. Token failed." });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized. No token found." });
    }
};

module.exports = { protect };
