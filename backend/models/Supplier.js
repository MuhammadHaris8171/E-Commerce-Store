const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  legalName: { type: String }, // Supplier Legal Name - optional
  shortName: { type: String }, // Short Name - optional
  taxRegistrationNo: { type: String }, // Tax Registration No - optional
  googleLocation: { type: String }, // Google Location - optional
  repName: { type: String }, // Rep. Name - optional
  mobileCall: { type: String }, // Mobile No - Call - optional
  mobileWhatsapp: { type: String }, // Mobile No - Whatsapp - optional
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" }, // Image - optional
  assignBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Assign Branch - optional
  tax: { type: mongoose.Schema.Types.ObjectId, ref: "Tax" }, // Tax - optional
}, {
  timestamps: true
});

module.exports = mongoose.model("Supplier", supplierSchema); 