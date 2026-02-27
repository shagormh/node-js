# 🚀 Node.js Basic to Advanced – Complete Learning Guide

A step-by-step, well-structured Node.js learning project covering everything from the absolute basics to advanced patterns used in production applications.

---

## 📁 Project Structure

```
node-js/
├── 01-basics/              → JavaScript fundamentals in Node.js
├── 02-core-modules/        → Built-in Node.js modules
├── 03-async-programming/   → Async patterns (Callbacks, Promises, Async/Await)
├── 04-http-server/         → Native HTTP module
├── 05-express/             → Express.js framework
├── 06-database/            → MongoDB, MySQL, Redis
├── 07-authentication/      → JWT, Bcrypt, Sessions
├── 08-advanced/            → Design Patterns, WebSockets, Testing
└── 09-rest-api-project/    → Full MVC REST API Project
```

---

## 📚 Sections Overview

### 01 – Basics
| File | Topic |
|---|---|
| 01-hello-world.js | First Node.js program, console, process |
| 02-variables-datatypes.js | var, let, const, data types |
| 03-control-flow.js | if/else, switch, loops |
| 04-functions.js | Regular, Arrow, IIFE, Higher-order |
| 05-classes-oop.js | Classes, Inheritance, Encapsulation |

### 02 – Core Modules
| File | Topic |
|---|---|
| 01-path-module.js | path.join, dirname, extname |
| 02-os-module.js | os.platform, os.cpus, memory |
| 03-fs-module.js | Read/Write files (sync & async) |
| 04-events-module.js | EventEmitter, custom events |
| 05-streams.js | Readable, Writable, Transform streams |
| 06-buffer.js | Buffer creation and manipulation |
| 07-crypto-module.js | Hashing, HMAC, encryption |
| 08-timers.js | setTimeout, setInterval, setImmediate |

### 03 – Async Programming
| File | Topic |
|---|---|
| 01-callbacks.js | Callback pattern, callback hell |
| 02-promises.js | Promise chaining, Promise.all |
| 03-async-await.js | async/await with try/catch |
| 04-error-handling.js | Custom errors, global error handling |
| 05-event-loop.js | Call stack, event loop, microtasks |

### 04 – HTTP Server
| File | Topic |
|---|---|
| 01-basic-server.js | Create HTTP server |
| 02-routing.js | Manual routing with http module |
| 03-json-api.js | JSON API without framework |
| 04-static-files.js | Serve static HTML/CSS/JS files |

### 05 – Express.js
| File | Topic |
|---|---|
| 01-basic-express.js | Express app setup |
| 02-middleware.js | Built-in and custom middleware |
| 03-routing/ | Modular routing |
| 04-error-handling.js | Express error middleware |
| 05-template-engine/ | EJS template engine |

### 06 – Database
| Folder | Topic |
|---|---|
| mongodb/ | Mongoose connect, CRUD, Models |
| mysql/ | MySQL2 connect, CRUD |
| redis/ | Redis basic usage |

### 07 – Authentication
| File | Topic |
|---|---|
| 01-jwt-auth.js | JSON Web Token sign and verify |
| 02-bcrypt-passwords.js | Password hashing and comparison |
| 03-session-auth.js | Express session management |

### 08 – Advanced
| Folder | Topic |
|---|---|
| design-patterns/ | Singleton, Factory, Observer, Middleware |
| websockets/ | Real-time WebSocket server with `ws` |
| testing/ | Unit & Integration tests with Jest |

### 09 – REST API Project
A complete MVC REST API (Express + MongoDB) with:
- User registration & login with JWT
- Password hashing with bcrypt
- Protected routes with auth middleware
- Full CRUD operations

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run any example
node 01-basics/01-hello-world.js
node 02-core-modules/03-fs-module.js
node 04-http-server/01-basic-server.js

# Run full REST API project
cd 09-rest-api-project
npm install
node server.js
```

---

## 🔧 Technologies Used
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Databases**: MongoDB (Mongoose), MySQL2, Redis
- **Auth**: JWT, Bcrypt, Express-Session
- **Real-time**: WebSocket (ws)
- **Testing**: Jest, Supertest
- **Templates**: EJS
