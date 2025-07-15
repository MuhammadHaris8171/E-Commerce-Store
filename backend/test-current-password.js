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
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function testPassword() {
  try {
    console.log('🔍 Testing current admin password...');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!admin) {
      console.log('❌ No admin user found!');
      console.log('💡 Run the password update script first.');
      return;
    }
    
    console.log('✅ Admin user found:', {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      hasPassword: !!admin.password
    });
    
    // Test old password
    const oldPasswordMatch = await bcrypt.compare('omar123@#*omar123', admin.password);
    console.log('🔑 Old password (omar123@#*omar123) match:', oldPasswordMatch);
    
    // Test new password
    const newPasswordMatch = await bcrypt.compare('243Gc794', admin.password);
    console.log('🔑 New password (243Gc794) match:', newPasswordMatch);
    
    if (newPasswordMatch) {
      console.log('✅ New password is working!');
    } else if (oldPasswordMatch) {
      console.log('⚠️  Still using old password. Run password update script.');
    } else {
      console.log('❌ Neither password works. Password may be different.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
}

// Run the test
testPassword(); 