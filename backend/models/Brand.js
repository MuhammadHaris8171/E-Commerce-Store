const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameAr: { type: String},
  logo: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
type: { type: String},
});

module.exports = mongoose.model("Brand", brandSchema);
