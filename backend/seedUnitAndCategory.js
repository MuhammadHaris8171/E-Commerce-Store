const mongoose = require('mongoose');
const Unit = require('./models/Units');
const ItemCategory = require('./models/ItemCategory');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';

async function seed() {
  await mongoose.connect(MONGO_URI);
  const unit = new Unit({ name: 'Piece', unitType: 'Count', Symbol: 'pc' });
  await unit.save();
  const category = new ItemCategory({ nameEn: 'Main Category', nameUr: '' });
  await category.save();
  console.log('Unit ID:', unit._id.toString());
  console.log('Category ID:', category._id.toString());
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 