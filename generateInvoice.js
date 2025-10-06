const PDFDocument = require("pdfkit");
const fs = require("fs");

/**
 * Generate a PDF Invoice
 * @param {Object} order - Order details
 * @param {String} filePath - Where to save the PDF
 */
function generateInvoice(order, filePath) {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe to file
  doc.pipe(fs.createWriteStream(filePath));

  // --- Header ---
  doc
    .image("public/images/gemora-logo.png", 50, 45, { width: 100 }) // use your logo path
    .fillColor("#444444")
    .fontSize(20)
    .text("Gemora Global", 160, 50)
    .fontSize(10)
    .text("Gemora Global", 200, 65, { align: "right" })
    .text("Lagos, Nigeria", 200, 80, { align: "right" })
    .text("support@gemora.com", 200, 95, { align: "right" })
    .moveDown();

  // --- Customer Info ---
  doc
    .fillColor("#000")
    .fontSize(16)
    .text("Invoice", { align: "center" })
    .moveDown();

  const customerInformationTop = 150;
  doc
    .fontSize(10)
    .text(`Invoice Number: ${order.invoiceNumber}`, 50, customerInformationTop)
    .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, customerInformationTop + 15)
    .text(`Customer Name: ${order.customerName}`, 50, customerInformationTop + 30)
    .text(`Email: ${order.customerEmail}`, 50, customerInformationTop + 45)
    .moveDown();

  // --- Table Header ---
  const invoiceTableTop = 250;
  doc.fontSize(12).text("Items", 50, invoiceTableTop);

  doc
    .fontSize(10)
    .text("Product", 50, invoiceTableTop + 25)
    .text("Quantity", 250, invoiceTableTop + 25)
    .text("Price", 350, invoiceTableTop + 25)
    .text("Total", 450, invoiceTableTop + 25);

  let position = invoiceTableTop + 50;

  // --- Items ---
  order.items.forEach(item => {
    const itemTotal = item.quantity * item.price;
    doc
      .text(item.name, 50, position)
      .text(item.quantity, 250, position)
      .text(`₦${item.price.toLocaleString()}`, 350, position)
      .text(`₦${itemTotal.toLocaleString()}`, 450, position);
    position += 25;
  });

  // --- Total ---
  doc.fontSize(12).text(`Grand Total: ₦${order.total.toLocaleString()}`, 400, position + 30);

  // --- Footer ---
  doc
    .fontSize(10)
    .fillColor("#777")
    .text("Thank you for shopping with Gemora Global!", 50, 700, { align: "center", width: 500 });

  // Finalize PDF file
  doc.end();
}

module.exports = generateInvoice;
