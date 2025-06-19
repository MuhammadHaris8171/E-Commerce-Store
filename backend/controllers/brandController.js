const Item = require('../models/Brand');
const Branch = require('../models/Branch');
const Image = require('../models/Image');

// GET all items with populated branch (name) and image (url)
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('branch', 'name')
      .populate('logo', 'url');  // You were populating 'image' but the field in your schema seems to be 'logo'
    res.json(items);
  } catch (error) {
    console.error("Failed to get items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// CREATE a new item
exports.createItem = async (req, res) => {
  try {
    const { nameEn, nameAr, logo, branch, type } = req.body;

    if (!nameEn || !nameAr || !logo || !branch || !type) {
      return res.status(400).json({ message: "All fields (nameEn, nameAr, logo, branch, type) are required." });
    }

    // Validate if referenced IDs exist
    const [foundBranch, foundLogo] = await Promise.all([
      Branch.findById(branch),
      Image.findById(logo),
    ]);

    if (!foundBranch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (!foundLogo) {
      return res.status(404).json({ message: "Logo image not found" });
    }

    const newItem = new Item({
      nameEn,
      nameAr,
      branch,
      logo,
      type
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE an existing item
exports.updateItem = async (req, res) => {
  try {
    // Optionally, you could validate if branch and logo IDs are valid here too if they are updated.
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
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE an item
exports.deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Return no content status when deleted successfully
    res.sendStatus(204);
  } catch (error) {
    console.error("Failed to delete item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
