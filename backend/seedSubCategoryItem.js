const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';

async function seedItem() {
  await mongoose.connect(MONGO_URI);
  const testItem = new Item({
    nameEn: 'Test Item',
    nameAlt: 'टेस्ट आइटम',
    baseUnit: null, // You can update with a valid ObjectId if needed
    category: null, // You can update with a valid ObjectId if needed
    tax: null,
    assignBranch: null,
    assignBrand: null,
    image: null,
    departments: [],
    unit: null,
    name: 'Test Item',
    unitCount: 1,
    subCategory: 'Methaai'
  });
  await testItem.save();
  console.log('Seeded test item with subCategory.');
  await mongoose.disconnect();
}

seedItem().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 