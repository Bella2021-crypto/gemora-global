const PDFDocument = require("pdfkit");
const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "gemora_invoices" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });

    // Header
    doc.fontSize(20).text("Gemora Global", 50, 50);
    doc.fontSize(10).text("support@gemora.com", 200, 65, { align: "right" });
    doc.fontSize(16).text("Invoice", { align: "center" }).moveDown();

    doc.fontSize(10).text(`Invoice #: ${order.invoiceNumber}`, 50, 150);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 165);
    doc.text(`Customer: ${order.customerName}`, 50, 180);
    doc.text(`Email: ${order.customerEmail}`, 50, 195);

    let y = 230;
    doc.text("Product", 50, y).text("Qty", 250, y).text("Price", 350, y).text("Total", 450, y);
    y += 25;

    order.items.forEach((item) => {
      const total = item.quantity * item.price;
      doc.text(item.name, 50, y)
         .text(item.quantity, 250, y)
         .text(`₦${item.price}`, 350, y)
         .text(`₦${total}`, 450, y);
      y += 25;
    });

    doc.fontSize(12).text(`Grand Total: ₦${order.total}`, 400, y + 30);
    doc.end();
  });
}

module.exports = generateInvoice;
