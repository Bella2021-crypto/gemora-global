import { useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([{ id: 1, name: "Luxury Watch", quantity: 1 }]);

  const handleCheckout = async () => {
    for (const item of cart) {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, quantity: item.quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }
    }
    alert("Checkout successful! Stock reduced.");
    setCart([]);
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} — Qty: {item.quantity}
        </div>
      ))}
      <button className="btn" onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
