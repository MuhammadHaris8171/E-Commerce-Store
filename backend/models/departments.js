const mongoose = require('mongoose');

const DepertmentsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
   branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch'},
}, { timestamps: true });

module.exports = mongoose.model('departments', DepertmentsSchema);