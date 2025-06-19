const Item = require('../models/Item');
const Category = require('../models/ItemCategory');
const Department = require('../models/departments');
const Unit = require('../models/Units');
const Image = require('../models/Image');

// GET all items with populated references
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('category', 'nameEn')
      .populate('departments', 'name')
      .populate('unit', 'name')
      .populate('image', 'url'); // Assumes image model has a 'url' field
    res.json(items);
  } catch (error) {
    console.error("Failed to get items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new item
exports.createItem = async (req, res) => {
  try {
    const { name, category, departments, unit, image } = req.body;

    if (!name || !category || !departments || !unit || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: Validate referenced IDs
    const [foundCategory, foundUnit, foundImage, foundDepartments] = await Promise.all([
      Category.findById(category),
      Unit.findById(unit),
      Image.findById(image),
      Department.find({ _id: { $in: departments } }),
    ]);

    if (!foundCategory || !foundUnit || !foundImage || foundDepartments.length === 0) {
      return res.status(404).json({ message: "Invalid references provided" });
    }

    const newItem = new Item({
      name,
      category,
      departments,
      unit,
      image,
    });

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
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
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
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};