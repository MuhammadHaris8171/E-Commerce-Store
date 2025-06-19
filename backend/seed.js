const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('./models/Role');
const User = require('./models/User');
const Units = require('./models/Units');
const Tax = require('./models/Tax');
const ItemCategory = require('./models/ItemCategory');
const Brand = require('./models/Brand');
const Currency = require('./models/Currency');
const Branch = require('./models/Branch');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Role.deleteMany({}),
      User.deleteMany({}),
      Units.deleteMany({}),
      Tax.deleteMany({}),
      ItemCategory.deleteMany({}),
      Brand.deleteMany({}),
      Currency.deleteMany({}),
      Branch.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create roles
    const roles = await Role.create([
      { name: 'admin', description: 'Administrator' },
      { name: 'manager', description: 'Store Manager' },
      { name: 'staff', description: 'Staff Member' }
    ]);
    console.log('Created roles');

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // Note: In production, this should be hashed
      role: roles[0]._id,
      isActive: true
    });
    console.log('Created admin user');

    // Create units
    const units = await Units.create([
      { name: 'Kilogram', symbol: 'kg' },
      { name: 'Gram', symbol: 'g' },
      { name: 'Liter', symbol: 'L' },
      { name: 'Piece', symbol: 'pcs' }
    ]);
    console.log('Created units');

    // Create taxes
    const taxes = await Tax.create([
      { name: 'VAT', rate: 16, isActive: true },
      { name: 'Service Tax', rate: 5, isActive: true }
    ]);
    console.log('Created taxes');

    // Create item categories
    const categories = await ItemCategory.create([
      { name: 'Groceries', description: 'Food and household items' },
      { name: 'Beverages', description: 'Drinks and refreshments' },
      { name: 'Snacks', description: 'Chips, cookies, and other snacks' }
    ]);
    console.log('Created categories');

    // Create brands
    const brands = await Brand.create([
      { name: 'Nestle', description: 'Food and beverage company' },
      { name: 'Coca-Cola', description: 'Beverage company' },
      { name: 'Unilever', description: 'Consumer goods company' }
    ]);
    console.log('Created brands');

    // Create currencies
    const currencies = await Currency.create([
      { name: 'US Dollar', code: 'USD', symbol: '$', isActive: true },
      { name: 'Euro', code: 'EUR', symbol: '€', isActive: true }
    ]);
    console.log('Created currencies');

    // Create branches
    const branches = await Branch.create([
      { 
        name: 'Main Branch',
        address: '123 Main Street',
        phone: '+1234567890',
        email: 'main@store.com',
        isActive: true
      },
      {
        name: 'Downtown Branch',
        address: '456 Downtown Ave',
        phone: '+1234567891',
        email: 'downtown@store.com',
        isActive: true
      }
    ]);
    console.log('Created branches');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 