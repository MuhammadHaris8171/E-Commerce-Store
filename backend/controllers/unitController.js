// controllers/unitController.js
const Unit = require("../models/Units");

// -------------------------
// GET  /units
// -------------------------
exports.getUnit = async (req, res) => {
  try {
    const units = await Unit.find();
    return res.status(200).json(units);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch units" });
  }
};

// -------------------------
// POST /units
// -------------------------
exports.addUnit = async (req, res) => {
  try {
    const { name, unitType, symbol } = req.body;
    if (!name || !unitType || !symbol) {
      return res.status(400).json({ error: "name, unitType & symbol are required" });
    }

    const unit = await Unit.create({ name, unitType, Symbol: symbol });
    return res.status(201).json(unit);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to add unit" });
  }
};

// -------------------------
// PUT /units/:id
// -------------------------
exports.updateUnit = async (req, res) => {
  try {
    const { name, unitType, symbol } = req.body;
    if (!name || !unitType || !symbol) {
      return res.status(400).json({ error: "name, unitType & symbol are required" });
    }

    const updated = await Unit.findByIdAndUpdate(
      req.params.id,
      { name, unitType, Symbol: symbol },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Unit not found" });

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update unit" });
  }
};

// -------------------------
// DELETE /units/:id
// -------------------------
exports.deleteUnit = async (req, res) => {
  try {
    const deleted = await Unit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Unit not found" });

    return res.status(200).json({ message: "Unit deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete unit" });
  }
};
