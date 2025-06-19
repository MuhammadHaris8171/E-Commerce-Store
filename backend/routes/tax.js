const express = require('express');
const router = express.Router();
const Tax = require('../models/Tax');

// Create tax
router.post('/', async (req, res) => {
  try {
    const tax = new Tax(req.body);
    await tax.save();
    res.status(201).json(tax);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all taxes
router.get('/', async (req, res) => {
  const taxes = await Tax.find();
  res.json(taxes);
});

// Update tax
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tax.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete tax
router.delete('/:id', async (req, res) => {
  try {
    await Tax.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tax deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
