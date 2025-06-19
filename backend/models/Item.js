const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ItemCategory", required: true },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "departments" }],
  unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "Image", required: true },
});

module.exports = mongoose.model("Item", itemSchema);
