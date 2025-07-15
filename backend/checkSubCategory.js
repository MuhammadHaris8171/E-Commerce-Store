const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

// Replace with your MongoDB connection string if not using env
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db_name';

async function checkSubCategory() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const items = await Item.find({ subCategory: { $exists: true } }).limit(10);
  console.log('Items with subCategory field:');
  items.forEach(item => {
    console.log({
      _id: item._id,
      name: item.name,
      subCategory: item.subCategory
    });
  });
  await mongoose.disconnect();
}

checkSubCategory().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 