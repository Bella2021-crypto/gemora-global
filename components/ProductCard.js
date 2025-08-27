export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price.toLocaleString()}</p>

      {product.stock > 0 ? (
        <button className="btn">Add to Cart</button>
      ) : (
        <button className="btn soldout" disabled>Sold Out</button>
      )}
    </div>
  );
}
