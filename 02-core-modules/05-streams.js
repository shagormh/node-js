/**
 * ============================================
 * 05 - Streams in Node.js
 * ============================================
 * Topics:
 *  - Readable streams
 *  - Writable streams
 *  - Duplex streams
 *  - Transform streams
 *  - Piping streams
 *  - Stream events
 * ============================================
 */

const fs = require("fs");
const path = require("path");
const { Readable, Writable, Transform, PassThrough, pipeline } = require("stream");
const { promisify } = require("util");

const pipelineAsync = promisify(pipeline);
const DEMO_DIR = path.join(__dirname, "stream-demo");

if (!fs.existsSync(DEMO_DIR)) fs.mkdirSync(DEMO_DIR, { recursive: true });

// ──────────────────────────────────────────
// 1. Readable Stream (from file)
// ──────────────────────────────────────────
console.log("=== Readable Stream ===");

// Create a sample file to read
const sampleFile = path.join(DEMO_DIR, "sample.txt");
fs.writeFileSync(sampleFile, "Line 1\nLine 2\nLine 3\nLine 4\nLine 5");

const readable = fs.createReadStream(sampleFile, {
    encoding: "utf-8",
    highWaterMark: 16, // 16 bytes at a time (small for demo)
});

readable.on("data", (chunk) => {
    process.stdout.write(`[chunk: "${chunk.replace(/\n/g, "\\n")}"]\n`);
});

readable.on("end", () => {
    console.log("✅ Readable stream finished");
});

readable.on("error", (err) => {
    console.error("Stream error:", err.message);
});

// ──────────────────────────────────────────
// 2. Writable Stream
// ──────────────────────────────────────────
console.log("\n=== Writable Stream ===");

const outputFile = path.join(DEMO_DIR, "output.txt");
const writable = fs.createWriteStream(outputFile, { flags: "w" });

writable.write("Hello from writable stream!\n");
writable.write("Second line!\n");
writable.write("Third line!\n");

writable.end(() => {
    console.log("✅ Writable stream closed");
    console.log("Written:", fs.readFileSync(outputFile, "utf-8").trim());
});

// ──────────────────────────────────────────
// 3. Piping (most common pattern)
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n=== Piping Streams ===");

    const src = path.join(DEMO_DIR, "sample.txt");
    const dest = path.join(DEMO_DIR, "piped-copy.txt");

    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
        console.log("✅ File copied via pipe");
        console.log("Content:", fs.readFileSync(dest, "utf-8").trim());
    });
}, 200);

// ──────────────────────────────────────────
// 4. Custom Readable Stream
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n=== Custom Readable Stream ===");

    class NumberStream extends Readable {
        constructor(max) {
            super({ objectMode: true });
            this.current = 1;
            this.max = max;
        }

        _read() {
            if (this.current <= this.max) {
                this.push(this.current++);
            } else {
                this.push(null); // signal end
            }
        }
    }

    const numbers = new NumberStream(5);
    numbers.on("data", (num) => process.stdout.write(`${num} `));
    numbers.on("end", () => console.log("\n✅ Custom readable done"));
}, 400);

// ──────────────────────────────────────────
// 5. Transform Stream
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n=== Transform Stream ===");

    // Uppercase transform
    class UppercaseTransform extends Transform {
        _transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }
    }

    const src = path.join(DEMO_DIR, "sample.txt");
    const dest = path.join(DEMO_DIR, "uppercased.txt");

    const r = fs.createReadStream(src, { encoding: "utf8" });
    const t = new UppercaseTransform();
    const w = fs.createWriteStream(dest);

    r.pipe(t).pipe(w);

    w.on("finish", () => {
        console.log("Uppercased:", fs.readFileSync(dest, "utf-8").trim());
        console.log("✅ Transform stream done");
    });
}, 600);

// ──────────────────────────────────────────
// 6. Readable from Array (Node 17.5+)
// ──────────────────────────────────────────
setTimeout(() => {
    console.log("\n=== Readable.from() ===");

    async function* generate() {
        yield "chunk 1\n";
        yield "chunk 2\n";
        yield "chunk 3\n";
    }

    const stream = Readable.from(generate());
    let collected = "";
    stream.on("data", (d) => (collected += d));
    stream.on("end", () => {
        console.log("Collected from generator:", collected.trim());
        console.log("✅ 05-streams.js complete!");
        // Cleanup
        setTimeout(() => fs.rmSync(DEMO_DIR, { recursive: true, force: true }), 100);
    });
}, 800);
