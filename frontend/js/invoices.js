async function loadInvoices() {
  const res = await fetch("/api/invoices");
  const invoices = await res.json();

  const tbody = document.querySelector("#invoiceTable tbody");
  tbody.innerHTML = "";

  invoices.forEach(inv => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inv.id}</td>
      <td>${new Date(inv.created_at).toLocaleString()}</td>
      <td><a href="${inv.url}" target="_blank">Download</a></td>
      <td><button onclick="deleteInvoice('${inv.id}')">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

async function deleteInvoice(id) {
  if (!confirm("Delete this invoice?")) return;
  await fetch(`/api/invoices/${id}`, { method: "DELETE" });
  loadInvoices();
}

loadInvoices();
