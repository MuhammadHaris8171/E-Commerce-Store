const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://Karyanastore:Karyanastore123@cluster0.izvxlqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema
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

async function updatePassword() {
  try {
    console.log('🔄 Updating admin password to: 243Gc794');
    console.log('👑 Setting role to: master_admin (full permissions)');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    
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
      console.log('✅ New master admin user created with password: 243Gc794');
    } else {
      console.log('📝 Admin user found. Updating password and role...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('243Gc794', salt);
      
      admin.password = hashedPassword;
      admin.role = 'master_admin';
      admin.name = 'Master Admin';
      admin.permissions = {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      };
      
      await admin.save();
      console.log('✅ Admin updated to master admin with password: 243Gc794');
    }
    
    console.log('🎉 Master admin setup completed successfully!');
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

// Run the update
updatePassword(); 