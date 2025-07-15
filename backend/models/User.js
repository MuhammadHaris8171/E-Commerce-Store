const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['master_admin', 'admin', 'user'],
    default: 'user'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  biometricId: { type: String },
  permissions: {
    canCreate: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canView: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user is master admin
userSchema.methods.isMasterAdmin = function() {
  return this.role === 'master_admin';
};

// Method to check if user has permission
userSchema.methods.hasPermission = function(action) {
  if (this.isMasterAdmin()) {
    return true; // Master admin has all permissions
  }
  return this.permissions[action] || false;
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.isModified('role')) {
    switch (this.role) {
      case 'master_admin':
        this.permissions = {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true
        };
        break;
      case 'admin':
        this.permissions = {
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canView: true
        };
        break;
      case 'user':
        this.permissions = {
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canView: true
        };
        break;
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
