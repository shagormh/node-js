/**
 * ============================================
 * 03 - The Observer Pattern (EventEmitter wrapper)
 * ============================================
 * Topics:
 *  - Subject maintaining a list of dependents (observers)
 *  - Notifying them of state changes
 *  - Commonly achieved via Node's native `EventEmitter`
 * ============================================
 */

const EventEmitter = require("events");

console.log("=== Observer Pattern Demo ===\n");

// ──────────────────────────────────────────
// The Subject (Observable)
// ──────────────────────────────────────────
class OrderService extends EventEmitter {
    constructor() {
        super();
        this.orders = [];
    }

    createOrder(orderData) {
        // 1. Business Logic
        const newOrder = {
            id: this.orders.length + 1,
            ...orderData,
            status: "pending",
            timestamp: new Date()
        };
        this.orders.push(newOrder);

        console.log(`\n📦 Order #${newOrder.id} created for ${newOrder.customer}`);

        // 2. Notify Observers (Publish event)
        this.emit("orderCreated", newOrder);
    }

    cancelOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            order.status = "cancelled";
            this.emit("orderCancelled", order);
        }
    }
}

// ──────────────────────────────────────────
// The Observers (Listeners)
// ──────────────────────────────────────────

// Service 1: Email Service
const sendConfirmationEmail = (order) => {
    console.log(`✉️  [EmailService] Sending confirmation email to ${order.customer} for order #${order.id}`);
};

// Service 2: Inventory Service
const deductInventory = (order) => {
    console.log(`🛒 [InventoryService] Deducting "${order.item}" (Qty: ${order.qty}) from warehouse stock`);
};

// Service 3: Analytics Service
const logAnalytics = (order) => {
    console.log(`📊 [AnalyticsService] Logging purchase event for "${order.item}" costing $${order.price}`);
};

// Error Handler
const handleOrderCancel = (order) => {
    console.log(`❌ [System] Order #${order.id} was cancelled. Restoring stock and refunding.`);
};


// ──────────────────────────────────────────
// Tying it together
// ──────────────────────────────────────────
const myOrderService = new OrderService();

// Register the Observers to the Subject
myOrderService.on("orderCreated", sendConfirmationEmail);
myOrderService.on("orderCreated", deductInventory);
myOrderService.on("orderCreated", logAnalytics);

myOrderService.on("orderCancelled", handleOrderCancel);

// Usage
console.log("Triggering Application Logic...\n");
myOrderService.createOrder({
    customer: "Alice",
    item: "Mechanical Keyboard",
    qty: 1,
    price: 150
});

setTimeout(() => {
    myOrderService.createOrder({
        customer: "Bob",
        item: "27-inch Monitor",
        qty: 2,
        price: 300
    });
}, 100);

setTimeout(() => {
    myOrderService.cancelOrder(1);
    console.log("\n✅ 03-observer.js complete!");
}, 200);
