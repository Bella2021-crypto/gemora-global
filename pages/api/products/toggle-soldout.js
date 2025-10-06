import { products } from "../../../lib/data";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { id, soldOut } = req.body;
  const product = products.find((p) => p.id === id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  product.soldOut = soldOut;

  return res.status(200).json(product);
}
