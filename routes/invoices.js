const express = require("express");
const cloudinary = require("../utils/cloudinary");

const router = express.Router();

// List all invoices from Cloudinary
router.get("/", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder=gemora_invoices")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const invoices = result.resources.map(file => ({
      id: file.public_id,
      url: file.secure_url,
      created_at: file.created_at,
    }));

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.id, { resource_type: "raw" });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
