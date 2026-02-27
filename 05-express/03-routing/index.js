/**
 * ============================================
 * 03 - Routing in Express (express.Router)
 * ============================================
 * Topics:
 *  - Modular routing with express.Router()
 *  - Separating routes into multiple files
 *  - Prefixing routes inside app.use()
 * ============================================
 */

const express = require("express");
const app = express();
const PORT = 4002;

app.use(express.json());

// ──────────────────────────────────────────
// 1. Defining Routers inline (Mocking separate files)
// ──────────────────────────────────────────
// In a real project, these would be in separate files like:
// `routes/userRoutes.js` and `routes/productRoutes.js`

// -- User Router --
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
    res.json({ message: "List of all users" });
});

userRouter.post("/", (req, res) => {
    res.status(201).json({ message: "User created", user: req.body });
});

userRouter.get("/:id", (req, res) => {
    res.json({ message: `Details for user ${req.params.id}` });
});


// -- Product Router --
const productRouter = express.Router();

// Middleware specific to to this router
productRouter.use((req, res, next) => {
    console.log(`[ProductRoute] ${req.method} ${req.url}`);
    next();
});

productRouter.get("/", (req, res) => {
    res.json({ message: "List of all products" });
});

productRouter.get("/:id", (req, res) => {
    res.json({ message: `Details for product ${req.params.id}` });
});


// ──────────────────────────────────────────
// 2. Mounting Routers
// ──────────────────────────────────────────

// Root route
app.get("/", (req, res) => {
    res.send("<h2>Express Modular Routing</h2><p>Visit /api/users or /api/products</p>");
});

// Mount user routes at /api/users
app.use("/api/users", userRouter);

// Mount product routes at /api/products
app.use("/api/products", productRouter);


// Start server
app.listen(PORT, () => {
    console.log(`✅ Routing Server running at http://localhost:${PORT}`);
});
