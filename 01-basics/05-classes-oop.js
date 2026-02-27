/**
 * ============================================
 * 05 - Classes & OOP in Node.js
 * ============================================
 * Topics:
 *  - Class declaration, constructor
 *  - Instance methods & properties
 *  - Static methods
 *  - Inheritance (extends, super)
 *  - Getters & Setters
 *  - Private fields (#)
 *  - Mixins
 *  - Abstract-like patterns
 * ============================================
 */

// ──────────────────────────────────────────
// 1. Basic Class
// ──────────────────────────────────────────
console.log("=== Basic Class ===");

class Animal {
    // Private field (ES2022)
    #sound;

    constructor(name, sound) {
        this.name = name;  // public property
        this.#sound = sound; // private property
    }

    // Instance method
    speak() {
        return `${this.name} says: ${this.#sound}`;
    }

    // Getter
    get info() {
        return `Animal: ${this.name}`;
    }

    // Setter
    set sound(value) {
        if (typeof value !== "string") throw new TypeError("Sound must be a string");
        this.#sound = value;
    }

    // Static method (called on class, not instance)
    static create(name, sound) {
        return new Animal(name, sound);
    }

    toString() {
        return `[Animal: ${this.name}]`;
    }
}

const dog = new Animal("Rex", "Woof");
console.log(dog.speak());  // Rex says: Woof
console.log(dog.info);     // Animal: Rex
dog.sound = "Bark!";
console.log(dog.speak());  // Rex says: Bark!

const cat = Animal.create("Whiskers", "Meow");
console.log(cat.speak());  // Whiskers says: Meow
console.log(`${dog}`);     // [Animal: Rex]

// ──────────────────────────────────────────
// 2. Inheritance (extends + super)
// ──────────────────────────────────────────
console.log("\n=== Inheritance ===");

class Dog extends Animal {
    #breed;

    constructor(name, breed) {
        super(name, "Woof");  // call parent constructor
        this.#breed = breed;
    }

    fetch(item) {
        return `${this.name} fetches the ${item}! 🐕`;
    }

    // Override parent method
    speak() {
        return `${super.speak()} (${this.#breed})`;
    }

    get breed() { return this.#breed; }
}

class Cat extends Animal {
    constructor(name, indoor = true) {
        super(name, "Meow");
        this.indoor = indoor;
    }

    purr() {
        return `${this.name} purrs... 😻`;
    }
}

const rex = new Dog("Rex", "German Shepherd");
console.log(rex.speak());       // Rex says: Woof (German Shepherd)
console.log(rex.fetch("ball")); // Rex fetches the ball!
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true

const kitty = new Cat("Kitty");
console.log(kitty.speak()); // Kitty says: Meow
console.log(kitty.purr());  // Kitty purrs...

// ──────────────────────────────────────────
// 3. Static Members
// ──────────────────────────────────────────
console.log("\n=== Static Members ===");

class MathUtils {
    static PI = 3.14159265358979;

    static circleArea(r) { return MathUtils.PI * r * r; }
    static circlePerimeter(r) { return 2 * MathUtils.PI * r; }
    static clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
}

console.log("Circle area (r=5):", MathUtils.circleArea(5).toFixed(2));
console.log("Clamp(150, 0, 100):", MathUtils.clamp(150, 0, 100));

// ──────────────────────────────────────────
// 4. Abstract-like Pattern (Node.js has no abstract keyword)
// ──────────────────────────────────────────
console.log("\n=== Abstract-like Class ===");

class Shape {
    constructor(color) {
        if (new.target === Shape) {
            throw new Error("Shape is abstract and cannot be instantiated directly.");
        }
        this.color = color;
    }

    // Force subclasses to implement this
    area() {
        throw new Error(`${this.constructor.name} must implement area()`);
    }

    toString() {
        return `${this.constructor.name}(color=${this.color}, area=${this.area().toFixed(2)})`;
    }
}

class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    area() { return Math.PI * this.radius ** 2; }
}

class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    area() { return this.width * this.height; }
}

// const s = new Shape("red"); // Error: Shape is abstract
const c = new Circle("red", 5);
const r = new Rectangle("blue", 4, 6);
console.log(`${c}`); // Circle(color=red, area=78.54)
console.log(`${r}`); // Rectangle(color=blue, area=24.00)

// ──────────────────────────────────────────
// 5. Mixin Pattern
// ──────────────────────────────────────────
console.log("\n=== Mixin Pattern ===");

const Serializable = (Base) =>
    class extends Base {
        serialize() { return JSON.stringify(this); }
        static deserialize(data) { return Object.assign(new this(), JSON.parse(data)); }
    };

const Validatable = (Base) =>
    class extends Base {
        validate() {
            return Object.keys(this).every((key) => this[key] !== null && this[key] !== undefined);
        }
    };

class BaseUser {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

class User extends Serializable(Validatable(BaseUser)) { }

const user = new User(1, "Alice", "alice@example.com");
console.log("Valid:", user.validate());          // true
console.log("Serialized:", user.serialize());    // JSON string

console.log("\n✅ 05-classes-oop.js complete!");
