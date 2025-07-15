const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_management';

async function setupSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      // Update existing admin with new password and ensure proper permissions
      existingAdmin.password = '243Gc794';
      existingAdmin.role = 'master_admin';
      existingAdmin.permissions = {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      };
      existingAdmin.isActive = true;
      
      await existingAdmin.save();
      console.log('✅ Super admin updated successfully');
      console.log('Email: admin@gmail.com');
      console.log('Password: 243Gc794');
      console.log('Role: master_admin');
      console.log('Permissions: Full access (create, edit, delete, view)');
    } else {
      // Create new super admin
      const superAdmin = new User({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        password: '243Gc794',
        role: 'master_admin',
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canView: true
        },
        isActive: true
      });

      await superAdmin.save();
      console.log('✅ Super admin created successfully');
      console.log('Email: admin@gmail.com');
      console.log('Password: 243Gc794');
      console.log('Role: master_admin');
      console.log('Permissions: Full access (create, edit, delete, view)');
    }

    // Update all other users to have view-only permissions
    const otherUsers = await User.find({ email: { $ne: 'admin@gmail.com' } });
    
    for (const user of otherUsers) {
      user.role = 'user';
      user.permissions = {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true
      };
      await user.save();
      console.log(`Updated user ${user.email} to view-only access`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`- Super admin: admin@gmail.com (full access)`);
    console.log(`- Other users: ${otherUsers.length} users updated to view-only access`);
    console.log(`\n🔐 Login credentials:`);
    console.log(`Email: admin@gmail.com`);
    console.log(`Password: 243Gc794`);

  } catch (error) {
    console.error('❌ Error setting up super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

setupSuperAdmin(); 