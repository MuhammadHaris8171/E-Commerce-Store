const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Production MongoDB URI
const MONGODB_URI = 'mongodb+srv://Karyanastore:Karyanastore123@cluster0.izvxlqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to production MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema with permissions
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  permissions: {
    canCreate: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canView: { type: Boolean, default: true }
  }
});

const User = mongoose.model('User', userSchema);

async function updateAdminPassword() {
  try {
    console.log('🔄 Setting up master admin for production...');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    console.log('Current admin user:', admin ? {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      permissions: admin.permissions
    } : 'Not found');

    if (!admin) {
      console.log('📝 Admin user not found. Creating new master admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('243Gc794', salt);
      
      const newAdmin = new User({
        name: 'Master Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'master_admin',
        isActive: true,
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true
        }
      });
      
      await newAdmin.save();
      console.log('✅ New master admin user created successfully!');
    } else {
      console.log('📝 Admin user found. Updating to master admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('243Gc794', salt);
      
      // Update all fields to ensure consistency
      admin.name = 'Master Admin';
      admin.password = hashedPassword;
      admin.role = 'master_admin';
      admin.isActive = true;
      admin.permissions = {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      };
      
      await admin.save();
      console.log('✅ Admin user updated to master admin successfully!');
      
      // Verify the password was saved correctly
      const verifyAdmin = await User.findOne({ email: 'admin@gmail.com' });
      console.log('✅ Verification - Master admin after update:', {
        _id: verifyAdmin._id,
        email: verifyAdmin.email,
        name: verifyAdmin.name,
        role: verifyAdmin.role,
        isActive: verifyAdmin.isActive,
        permissions: verifyAdmin.permissions,
        hasPassword: !!verifyAdmin.password
      });
    }
    
    console.log('🎉 Production master admin setup completed!');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: 243Gc794');
    console.log('   Role: master_admin');
    console.log('   Permissions: Full CRUD access');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

updateAdminPassword(); 