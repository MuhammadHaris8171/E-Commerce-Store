const Item = require('../models/Item');
const Category = require('../models/ItemCategory');
const Department = require('../models/departments');
const Unit = require('../models/Units');
const Image = require('../models/Image');
const Tax = require('../models/Tax');
const Branch = require('../models/Branch');
const Brand = require('../models/Brand');

// GET all items with populated references
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category', 'nameEn')
      .populate('subCategory', 'nameEn')
      .populate('departments', 'name')
      .populate('unit', 'name')
      .populate('baseUnit', 'name')
      .populate('tax', 'name')
      .populate('assignBranch', 'name')
      .populate('assignBrand', 'name')
      .populate('image', 'url');
    res.json(items);
  } catch (error) {
    console.error("Failed to get items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to filter out empty values
const filterEmptyValues = (obj) => {
  const filtered = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

// CREATE a new item
exports.createItem = async (req, res) => {
  try {
    const { 
      nameEn, 
      nameAlt, 
      baseUnit, 
      category, 
      tax, 
      assignBranch, 
      assignBrand, 
      departments, 
      unit, 
      image,
      name, // Keep for compatibility
      unitCount, // Add unitCount
      subCategory // Add subCategory
    } = req.body;

    // Check required fields
    if (!baseUnit || !category || !unit || !nameEn) {
      return res.status(400).json({ 
        message: "Base Unit, Category, Unit, and Name (Eng) are required fields" 
      });
    }

    // Filter out empty values to prevent ObjectId casting errors
    const itemData = filterEmptyValues({
      nameEn,
      nameAlt,
      baseUnit,
      category,
      tax,
      assignBranch,
      assignBrand,
      departments: departments || [],
      unit,
      image,
      name: nameEn,
      unitCount, // Add unitCount
      subCategory // Add subCategory
    });

    const newItem = new Item(itemData);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE an existing item
exports.updateItem = async (req, res) => {
  try {
    const { nameEn, nameAlt, baseUnit, category, tax, assignBranch, assignBrand, departments, unit, image, name, unitCount, subCategory } = req.body;
    
    // Check required fields
    if (!baseUnit || !category || !unit || !nameEn) {
      return res.status(400).json({ 
        message: "Base Unit, Category, Unit, and Name (Eng) are required fields" 
      });
    }
    
    // Filter out empty values
    const updateData = filterEmptyValues({
      nameEn,
      nameAlt,
      baseUnit,
      category,
      tax,
      assignBranch,
      assignBrand,
      departments: departments || [],
      unit,
      image,
      name: nameEn,
      unitCount, // Add unitCount
      subCategory // Add subCategory
    });

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Failed to update item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Failed to delete item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category', 'nameEn')
      .populate('subCategory', 'nameEn')
      .populate('departments', 'name')
      .populate('unit', 'name')
      .populate('baseUnit', 'name')
      .populate('tax', 'name')
      .populate('assignBranch', 'name')
      .populate('assignBrand', 'name')
      .populate('image', 'url');
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};