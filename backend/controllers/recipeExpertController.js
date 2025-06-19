const RecipeExpert = require('../models/RecipeExpert');

// Get all recipe experts with populated expert user data
exports.getAll = async (req, res) => {
  try {
    const data = await RecipeExpert.find().populate('experts');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create new recipe expert entry
exports.create = async (req, res) => {
  try {
    const { name, experts } = req.body;
    const newExpert = new RecipeExpert({ name, experts });
    await newExpert.save();
    res.json(newExpert);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
};

// ✅ Update existing recipe expert
exports.update = async (req, res) => {
  try {
    const { name, experts } = req.body;
    const updated = await RecipeExpert.findByIdAndUpdate(
      req.params.id,
      { name, experts },
      { new: true }
    ).populate('experts');
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid update request' });
  }
};

// ✅ Delete a recipe expert
exports.remove = async (req, res) => {
  try {
    const deleted = await RecipeExpert.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Deletion failed' });
  }
};
