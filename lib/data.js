// lib/data.js
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

export function getProducts() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}
export function saveProducts(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}
export const products = [
  { id: 1, name: "Luxury Watch", price: 1500, stock: 10 },
  { id: 2, name: "Designer Bag", price: 2300, stock: 5 },
  { id: 3, name: "Diamond Ring", price: 5000, stock: 0 }, // Sold out
];
