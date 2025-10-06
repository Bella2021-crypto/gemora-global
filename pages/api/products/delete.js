// pages/api/products/delete.js

// For now we’ll just use the in-memory "seed" products from lib/data.js.
// In production you’d hook this into your NeonDB (Postgres).

import { products } from "../../../lib/data";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  // Simulate deletion from in-memory array
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1); // remove from array

  return res.status(200).json({ message: "Product deleted successfully" });
}
