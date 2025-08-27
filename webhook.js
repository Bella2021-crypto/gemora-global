import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import nodemailer from "nodemailer";

const app = express();
app.use(bodyParser.json());

// Replace with your Paystack secret key
const PAYSTACK_SECRET = "sk_live_9aba89c843a3b7d4924f00cd6ccbe326297244ad";

// Nodemailer setup (using Gmail here, but you can use any SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gemoraglobal@gmail.com",
    pass: "GemoraAdmin!2025" // generate Gmail App password
  }
});

// Webhook endpoint
app.post("/paystack/webhook", (req, res) => {
  // Verify Paystack signature
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const customerEmail = event.data.customer.email;
    const amountPaid = event.data.amount / 100; // Convert from kobo
    const reference = event.data.reference;

    // Send email receipt
    const mailOptions = {
      from: "Gemora Global <gemoraglobal@gmail.com>",
      to: customerEmail,
      subject: "Payment Receipt - Gemora Global",
      text: `Hello ${event.data.metadata.custom_fields[0].value},\n\nThank you for your payment of ₦${amountPaid}.\nReference: ${reference}\n\nYour order is being processed.\n\n- Gemora Global`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Receipt sent:", info.response);
      }
    });
  }

  res.sendStatus(200);
});

app.listen(5000, () => console.log("Webhook server running on port 5000"));

// Send email receipt (HTML version)
const mailOptions = {
  from: "Gemora Global <gemoraglobal@gmail.com>",
  to: customerEmail,
  subject: "Payment Receipt - Gemora Global",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://yourdomain.com/images/gemora-logo.png" alt="Gemora Global" style="max-width: 150px; margin-bottom: 20px;">
        <h2 style="color: #333;">Payment Receipt</h2>
      </div>
      
      <p>Hello <strong>${event.data.metadata.custom_fields[0].value}</strong>,</p>
      <p>Thank you for your payment. Here are your transaction details:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">₦${amountPaid}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Reference</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${reference}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${customerEmail}</td>
        </tr>
      </table>

      <p>Your order is being processed and will be shipped shortly.</p>
      
      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 14px; color: #777;">&copy; ${new Date().getFullYear()} Gemora Global. All rights reserved.</p>
      </div>
    </div>
  `
};

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// Inside your webhook after payment is successful:
const amountPaid = event.data.amount / 100;
const reference = event.data.reference;
const customerEmail = event.data.customer.email;
const customerName = event.data.metadata?.custom_fields?.[0]?.value || "Customer";

// Generate PDF Invoice
const doc = new PDFDocument();
const invoicePath = path.join(__dirname, `invoice-${reference}.pdf`);
doc.pipe(fs.createWriteStream(invoicePath));

doc.fontSize(20).text("Gemora Global - Invoice", { align: "center" });
doc.moveDown();

doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
doc.text(`Invoice Reference: ${reference}`);
doc.text(`Customer: ${customerName}`);
doc.text(`Email: ${customerEmail}`);
doc.moveDown();

doc.text(`Amount Paid: ₦${amountPaid}`, { bold: true });
doc.moveDown(2);

doc.text("Thank you for shopping with Gemora Global!", { align: "center" });
doc.end();

// Wait until PDF is fully created before sending email
doc.on("finish", () => {
  const mailOptions = {
    from: "Gemora Global <gemoraglobal@gmail.com>",
    to: customerEmail,
    subject: "Payment Receipt - Gemora Global",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://yourdomain.com/images/gemora-logo.png" alt="Gemora Global" style="max-width: 150px; margin-bottom: 20px;">
          <h2 style="color: #333;">Payment Receipt</h2>
        </div>
        
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>Thank you for your payment. Here are your transaction details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount Paid</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">₦${amountPaid}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Reference</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reference}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${customerEmail}</td>
          </tr>
        </table>

        <p>Your order is being processed and will be shipped shortly.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="font-size: 14px; color: #777;">&copy; ${new Date().getFullYear()} Gemora Global. All rights reserved.</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `invoice-${reference}.pdf`,
        path: invoicePath
      }
    ]
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email with invoice sent:", info.response);
    }
  });
});
