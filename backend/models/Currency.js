const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  currencyName: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Currency', CurrencySchema);