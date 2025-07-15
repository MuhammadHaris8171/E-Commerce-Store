const SubCategory = require('../models/SubCategory');

exports.getSubCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const subCategories = await SubCategory.find(filter).populate('category', 'nameEn');
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('category', 'nameEn');
    if (!subCategory) return res.status(404).json({ message: 'Not found' });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { nameEn, nameAlt, category } = req.body;
    if (!nameEn || !category) return res.status(400).json({ message: 'nameEn and category are required' });
    const subCategory = new SubCategory({ nameEn, nameAlt, category });
    await subCategory.save();
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { nameEn, nameAlt, category } = req.body;
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { nameEn, nameAlt, category },
      { new: true, runValidators: true }
    );
    if (!subCategory) return res.status(404).json({ message: 'Not found' });
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 