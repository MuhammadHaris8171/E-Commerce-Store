const mongoose = require('mongoose');

const ItemCategorySchema = new mongoose.Schema({
  nameEn: String,
  nameUr: String
}, { timestamps: true });

module.exports = mongoose.model('ItemCategory', ItemCategorySchema);
