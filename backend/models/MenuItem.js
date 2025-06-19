const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
