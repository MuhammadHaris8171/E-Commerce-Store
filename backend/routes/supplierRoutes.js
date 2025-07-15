const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");

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

// Get all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .populate("image")
      .populate("assignBranch")
      .populate("tax");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single supplier
router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
      .populate("image")
      .populate("assignBranch")
      .populate("tax");
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create supplier
router.post("/", async (req, res) => {
  try {
    // Filter out empty values to prevent ObjectId casting errors
    const supplierData = filterEmptyValues(req.body);
    const supplier = new Supplier(supplierData);
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update supplier
router.put("/:id", async (req, res) => {
  try {
    // Filter out empty values
    const updateData = filterEmptyValues(req.body);
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json(supplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete supplier
router.delete("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
    res.json({ message: "Supplier deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 