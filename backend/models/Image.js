const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },   // new field 'name'
  tag: { type: String, required: false },    // new field 'tag', optional
  publicId: String
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
