import { getProducts, saveProducts } from "../../../lib/data";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id, name, price, stock } = req.body;

    let products = getProducts();
    const idx = products.findIndex((p) => p.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products[idx] = {
      ...products[idx],
      name: name ?? products[idx].name,
      price: price !== undefined ? Number(price) : products[idx].price,
      stock: stock !== undefined ? Number(stock) : products[idx].stock,
    };

    saveProducts(products);

    return res.status(200).json({ message: "Product updated", product: products[idx] });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
