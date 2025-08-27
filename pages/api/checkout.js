// pages/api/checkout.js
import { getProducts, saveProducts } from "../../lib/data";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id, quantity } = req.body;

    let products = getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // Reduce stock
    product.stock -= quantity;

    // Save to file
    saveProducts(products);

    return res.status(200).json({ message: "Checkout successful", product });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
