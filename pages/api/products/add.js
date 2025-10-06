import { getProducts, saveProducts } from "../../../lib/data";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Missing fields" });
    }

    let products = getProducts();

    const newProduct = {
      id: Date.now(), // simple unique ID
      name,
      price: Number(price),
      stock: Number(stock),
    };

    products.push(newProduct);
    saveProducts(products);

    return res.status(201).json({ message: "Product added", product: newProduct });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
