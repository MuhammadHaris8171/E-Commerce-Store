const mongoose = require('mongoose');

const PackagingSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  type: {
    type: String,
    enum: ['base', 'pack'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['L', 'ml', 'kg', 'g', 'pcs']
  },
  packSize: {
    type: Number,
    min: [1, 'Pack size must be at least 1']
  },
  packUnit: {
    type: String,
    enum: ['x', 'per']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for better queries
PackagingSchema.index({ itemId: 1, type: 1 });

// Validation: packSize and packUnit required for pack type
// PackagingSchema.pre('save', function(next) {
//   if (this.type === 'pack') {
//     if (!this.packSize || !this.packUnit) {
//       return next(new Error('Pack size and pack unit are required for pack type packaging'));
//     }
//   }
//   next();
// });

module.exports = mongoose.model('Packaging', PackagingSchema);
