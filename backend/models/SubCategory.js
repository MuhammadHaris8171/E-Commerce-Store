const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameAlt: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', SubCategorySchema); 