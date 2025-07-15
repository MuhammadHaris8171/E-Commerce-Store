const express = require("express");
const router = express.Router();
const PackageItem = require("../models/PackageItem");

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

// Get all package items
router.get("/", async (req, res) => {
  try {
    const packageItems = await PackageItem.find()
      .populate("supplierName")
      .populate("pricingUOM")
      .populate("image");
    res.json(packageItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single package item
router.get("/:id", async (req, res) => {
  try {
    const packageItem = await PackageItem.findById(req.params.id)
      .populate("supplierName")
      .populate("pricingUOM")
      .populate("image");
    if (!packageItem) {
      return res.status(404).json({ message: "Package item not found" });
    }
    res.json(packageItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create package item
router.post("/", async (req, res) => {
  try {
    // Filter out empty values to prevent ObjectId casting errors
    const packageItemData = filterEmptyValues(req.body);
    const packageItem = new PackageItem(packageItemData);
    const newPackageItem = await packageItem.save();
    res.status(201).json(newPackageItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update package item
router.put("/:id", async (req, res) => {
  try {
    // Filter out empty values
    const updateData = filterEmptyValues(req.body);
    const packageItem = await PackageItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!packageItem) {
      return res.status(404).json({ message: "Package item not found" });
    }
    res.json(packageItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete package item
router.delete("/:id", async (req, res) => {
  try {
    const packageItem = await PackageItem.findByIdAndDelete(req.params.id);
    if (!packageItem) {
      return res.status(404).json({ message: "Package item not found" });
    }
    res.json({ message: "Package item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 