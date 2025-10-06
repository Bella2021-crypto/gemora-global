import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use(express.static(process.cwd())); // serve your HTML files (index.html, admin.html, etc.)

// File paths
const PRODUCTS_FILE = path.join(process.cwd(), "products.json");
const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// Utility functions
function load(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
}

function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ✅ PRODUCTS API
app.get("/api/products", (req, res) => {
  res.json(load(PRODUCTS_FILE));
});

app.post("/api/products", (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const products = load(PRODUCTS_FILE);
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  save(PRODUCTS_FILE, products);

  res.json(newProduct);
});

app.delete("/api/products/:id", (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  let products = load(PRODUCTS_FILE);
  products = products.filter((p) => p.id !== parseInt(req.params.id));
  save(PRODUCTS_FILE, products);

  res.json({ success: true });
});

// ✅ IMAGE UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "images/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/admin/upload", upload.single("image"), (req, res) => {
  res.json({ path: "/images/" + req.file.filename });
});

// ✅ ORDERS API
app.post("/api/orders", (req, res) => {
  const orders = load(ORDERS_FILE);
  const order = {
    ...req.body,
    id: Date.now(),
    date: new Date().toISOString(),
    status: "Pending",
  };
  orders.push(order);
  save(ORDERS_FILE, orders);
  res.json({ success: true });
});

app.get("/api/orders", (req, res) => {
  res.json(load(ORDERS_FILE));
});

app.put("/api/orders/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const orders = load(ORDERS_FILE);
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Order not found" });

  order.status = status;
  save(ORDERS_FILE, orders);

  res.json({ success: true });
});

// ✅ SERVER START
app.listen(PORT, () => {
  console.log(`✅ Gemora Global server running at http://localhost:${PORT}`);
});
