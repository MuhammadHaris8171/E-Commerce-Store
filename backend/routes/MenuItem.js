const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/', async (req, res) => {
  const items = await MenuItem.find().populate('brand');
  res.json(items);
});

// Create menu item
router.post('/', async (req, res) => {
  const { name, brand } = req.body;
  const item = await MenuItem.create({ name, brand });
  res.json(item);
});

// Update menu item
router.put('/:id', async (req, res) => {
  const { name, brand } = req.body;
  const item = await MenuItem.findByIdAndUpdate(req.params.id, { name, brand }, { new: true });
  res.json(item);
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
