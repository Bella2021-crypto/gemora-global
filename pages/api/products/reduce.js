import { products } from "../../../lib/data";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id } = req.body;
  const product = products.find((p) => p.id === id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  if (product.stock > 0) {
    product.stock -= 1;
  }

  if (product.stock === 0) {
    product.soldOut = true;
  }

  return res.status(200).json(product);
}
