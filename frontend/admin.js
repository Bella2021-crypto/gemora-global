const API_URL = "http://localhost:5000/products";
const productList = document.getElementById("productList");
const addForm = document.getElementById("addProductForm");

async function fetchProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  renderProducts(products);
}

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${p.name}</strong> - $${p.price}</p>
      <img src="${p.image}" width="100"><br>
      <button onclick="deleteProduct(${p.id})">Delete</button>
      <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, '${p.image}')">Edit</button>
    `;
    productList.appendChild(div);
  });
}

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newProduct = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    image: document.getElementById("image").value,
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });
  fetchProducts();
});

async function deleteProduct(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchProducts();
}

async function editProduct(id, name, price, image) {
  const newName = prompt("Edit name:", name);
  const newPrice = prompt("Edit price:", price);
  const newImage = prompt("Edit image URL:", image);

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, price: newPrice, image: newImage }),
  });
  fetchProducts();
}

fetchProducts();
