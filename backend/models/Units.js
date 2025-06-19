const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  unitType: {
    type: String,
    required: true,
  },
   Symbol: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Unit', UnitSchema);