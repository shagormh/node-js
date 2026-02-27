/**
 * ============================================
 * 01 - WebSocket Server (`ws`)
 * ============================================
 * Topics:
 *  - Creating a basic WebSocket server
 *  - Handling connection, message, and close events
 *  - Broadcasting messages to all connected clients
 * ============================================
 * Note: Requires `npm install ws`
 */

const WebSocket = require("ws");
const http = require("http");

console.log("=== WebSocket Server Demo ===\n");

const PORT = 8080;

// 1. Create a standard HTTP Server (optional but good practice for sharing ports)
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
    <h1>WebSocket Server is Running!</h1>
    <p>Connect using a WebSocket client at ws://localhost:${PORT}</p>
    <script>
      // Simple client code for testing in the browser console
      const ws = new WebSocket("ws://" + location.host);
      ws.onopen = () => ws.send("Hello from browser!");
      ws.onmessage = (e) => console.log("Received:", e.data);
    </script>
  `);
});

// 2. Attach WebSocket Server to the HTTP Server
const wss = new WebSocket.Server({ server });

let clientCount = 0;

// 3. Handle Connections
wss.on("connection", (ws, req) => {
    clientCount++;
    const clientId = clientCount;
    const ip = req.socket.remoteAddress;

    console.log(`[+] Client #${clientId} connected from ${ip}`);

    // Send a welcome message to the new client
    ws.send(JSON.stringify({
        type: "system",
        message: `Welcome! You are client #${clientId}`
    }));

    // Broadcast to EVERYONE that a new user joined
    broadcastExcept(ws, {
        type: "system",
        message: `Client #${clientId} has joined the chat.`
    });

    // 4. Handle Incoming Messages
    ws.on("message", (message) => {
        // Note: The message comes as a Buffer in modern 'ws' versions
        const textMsg = message.toString();
        console.log(`[Client #${clientId}]: ${textMsg}`);

        // Echo back to everyone as a chat message
        broadcast({
            type: "chat",
            sender: `Client #${clientId}`,
            text: textMsg
        });
    });

    // 5. Handle Disconnections
    ws.on("close", () => {
        console.log(`[-] Client #${clientId} disconnected`);
        broadcastExcept(ws, {
            type: "system",
            message: `Client #${clientId} left the chat.`
        });
    });

    // Handle Errors
    ws.on("error", (error) => {
        console.error(`[!] WebSocket Error on Client #${clientId}:`, error.message);
    });
});

// ──────────────────────────────────────────
// Helper: Broadcast to ALL connected clients
// ──────────────────────────────────────────
function broadcast(dataObj) {
    const payload = JSON.stringify(dataObj);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

// Helper: Broadcast to all EXCEPT the sender
function broadcastExcept(senderWs, dataObj) {
    const payload = JSON.stringify(dataObj);
    wss.clients.forEach((client) => {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

// ──────────────────────────────────────────
// Start the Combined Server
// ──────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`✅ WebSocket Server running on ws://localhost:${PORT}`);
    console.log(`   (You can also visit http://localhost:${PORT} in your browser to test)`);
});
