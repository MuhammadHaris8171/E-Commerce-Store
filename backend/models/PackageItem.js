const mongoose = require("mongoose");

const packageItemSchema = new mongoose.Schema({
  packageItemName: { type: String }, // Package Item Name - optional
  supplierName: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" }, // Supplier Name - optional
  supplierItemName: { type: String }, // Supplier Item Name - optional
  supplierItemCode: { type: String }, // Supplier Item Code - optional
  pricingUOM: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" }, // Pricing UOM - optional
  priceExclVat: { type: Number }, // Price (Excl. Vat) - optional
  priceInclVat: { type: Number }, // Price (Incl. Vat) - optional
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, // Image - optional
}, {
  timestamps: true
});

module.exports = mongoose.model("PackageItem", packageItemSchema); 