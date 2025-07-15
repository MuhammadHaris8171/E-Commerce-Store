const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Remove any admin user with @example.com
    await User.deleteMany({ email: 'admin@example.com' });

    // Find the admin user with @gmail.com
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      // Create admin user if not exists
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
      });
      await adminUser.save();
      console.log('Created new admin user:', adminUser);
    } else {
      // Update existing admin user
      adminUser.name = 'Admin User';
      adminUser.password = 'admin123';
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Updated admin user:', adminUser);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdminUser(); 