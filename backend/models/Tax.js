const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  taxRate: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Tax', taxSchema);
