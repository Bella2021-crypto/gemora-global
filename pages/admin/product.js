import { useEffect, useState } from "react";
import ProductForm from "../../components/ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addProduct = async (product) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    const newProduct = await res.json();
    setProducts([...products, newProduct]);
  };

  return (
    <div className="admin-content">
      <h2>Manage Products</h2>
      <ProductForm onSubmit={addProduct} />

      <div className="product-list">
        {products.map((p) => (
          <div key={p._id} className="card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p className="price">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
