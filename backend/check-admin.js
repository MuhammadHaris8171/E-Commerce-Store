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

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function checkAdminUser() {
  try {
    // Find admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!admin) {
      console.log('No admin user found!');
      return;
    }

    console.log('Admin user found:', {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      hasPassword: !!admin.password,
      passwordLength: admin.password ? admin.password.length : 0
    });

    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log('Password test result:', isMatch ? 'Password matches!' : 'Password does not match!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

checkAdminUser(); 