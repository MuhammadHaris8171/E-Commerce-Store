const mongoose = require('mongoose');
const Unit = require('./models/Units');
const ItemCategory = require('./models/ItemCategory');
const Item = require('./models/Item');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';

async function seedAll() {
  await mongoose.connect(MONGO_URI);

  // Seed Unit
  const unit = new Unit({ name: 'Piece', unitType: 'Count', Symbol: 'pc' });
  await unit.save();

  // Seed ItemCategory
  const category = new ItemCategory({ nameEn: 'Main Category', nameUr: '' });
  await category.save();

  // Seed Item with references
  const item = new Item({
    nameEn: 'Test Item',
    nameAlt: 'Test Item Alt',
    baseUnit: unit._id,
    category: category._id,
    tax: null,
    assignBranch: null,
    assignBrand: null,
    image: null,
    departments: [],
    unit: unit._id,
    name: 'Test Item',
    unitCount: 1,
    subCategory: 'Sub Category'
  });
  await item.save();

  console.log('Seeded Unit ID:', unit._id.toString());
  console.log('Seeded Category ID:', category._id.toString());
  console.log('Seeded Item ID:', item._id.toString());

  await mongoose.disconnect();
}

seedAll().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 