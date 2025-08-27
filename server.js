const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./db.json";

// Helper to read/write database
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all products
app.get("/products", (req, res) => {
  res.json(readDB().products);
});

// Add product
app.post("/products", (req, res) => {
  const db = readDB();
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  writeDB(db);
  res.json(newProduct);
});

// Update product
app.put("/products/:id", (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });

  db.products[index] = { ...db.products[index], ...req.body };
  writeDB(db);
  res.json(db.products[index]);
});

// Delete product
app.delete("/products/:id", (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id != req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
