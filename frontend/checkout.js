const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartTableBody = document.querySelector("#cartTable tbody");
const cartTotalEl = document.getElementById("cartTotal");
const payBtn = document.getElementById("payBtn");

let totalAmount = 0;

// Render cart items
function renderCart() {
  cartTableBody.innerHTML = "";
  totalAmount = 0;

  cart.forEach(item => {
    const row = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td><img src="${item.image}" alt="${item.name}" width="50"></td>
      <td>$${item.price}</td>
      <td>${item.quantity}</td>
      <td>$${itemTotal}</td>
    `;
    cartTableBody.appendChild(row);
  });

  cartTotalEl.innerText = `Total: $${totalAmount}`;
}

// Paystack Checkout
payBtn.addEventListener("click", function() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let handler = PaystackPop.setup({
    key: "pk_test_xxxxxxxxxxxxx", // replace with your Paystack public key
    email: "customer@email.com",
    amount: totalAmount * 100, // Paystack works with kobo (multiply by 100)
    currency: "NGN",
    ref: "GEMORA_" + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      alert("Payment successful! Reference: " + response.reference);
      localStorage.removeItem("cart"); // clear cart after payment
      window.location.href = "index.html"; // redirect back to store
    },
    onClose: function() {
      alert("Payment window closed.");
    }
  });
  handler.openIframe();
});

renderCart();
