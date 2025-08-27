const API_URL = "http://localhost:5000/products";
const productGrid = document.getElementById("productGrid");

// Fetch and display products
async function loadProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  productGrid.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" width="150">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image}')">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });
}

// Cart logic
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart`);
}

loadProducts();
