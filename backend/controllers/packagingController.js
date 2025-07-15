const Item = require('../models/Item');
const Packaging = require('../models/Packaging');

// @desc    Add packaging to item
// @route   POST /api/items/:id/packaging
// @access  Private
exports.addPackaging = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, amount, unit, packSize, packUnit } = req.body;

    // Basic input validation
    if (!['base', 'pack'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid packaging type' });
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (!unit) {
      return res.status(400).json({ success: false, message: 'Unit is required' });
    }

    if (type === 'pack') {
      if (!packSize || isNaN(packSize) || parseInt(packSize) < 1 || !packUnit) {
        return res.status(400).json({
          success: false,
          message: 'packSize and packUnit are required and must be valid for pack-type packaging'
        });
      }
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Prepare embedded data
    const packagingData = {
      amount: parseFloat(amount),
      unit,
      createdAt: new Date()
    };

    if (type === 'pack') {
      packagingData.packSize = parseInt(packSize);
      packagingData.packUnit = packUnit;
    }

    // Save to item
    if (type === 'base') {
      item.basePackaging = packagingData;
    } else {
      item.packPackaging = packagingData;
    }

    await item.save();

    // Mark previous active history inactive
    await Packaging.updateMany({ itemId: id, type, isActive: true }, { isActive: false });

    // Create new packaging history record
    await Packaging.create({
      itemId: id,
      type,
      amount: parseFloat(amount),
      unit,
      isActive: true,
      createdBy: req.user.id,
      ...(type === 'pack' && {
        packSize: parseInt(packSize),
        packUnit
      })
    });

    res.status(201).json({
      success: true,
      message: 'Packaging added successfully',
      data: item
    });
  } catch (error) {
    console.error('Add packaging error:', error);
    next(error);
  }
};

// @desc    Get packaging history for item
// @route   GET /api/items/:id/packaging
// @access  Public
exports.getPackagingByItemId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const packaging = await Packaging.find({ itemId: id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: packaging.length,
      data: packaging
    });
  } catch (error) {
    console.error('Error fetching packaging:', error);
    next(error);
  }
};

// @desc    Get active packaging history (latest only)
// @route   GET /api/items/:id/packaging/history
// @access  Public
exports.getPackagingHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const packagingHistory = await Packaging.find({ itemId: id, isActive: true })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: packagingHistory.length,
      data: packagingHistory
    });
  } catch (error) {
    console.error('Get packaging history error:', error);
    next(error);
  }
};

// @desc    Update packaging
// @route   PUT /api/items/:id/packaging
// @access  Private
exports.updatePackaging = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, amount, unit, packSize, packUnit } = req.body;

    if (!['base', 'pack'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid packaging type' });
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (!unit) {
      return res.status(400).json({ success: false, message: 'Unit is required' });
    }

    if (type === 'pack' && (!packSize || isNaN(packSize) || !packUnit)) {
      return res.status(400).json({
        success: false,
        message: 'packSize and packUnit are required and must be valid for pack-type packaging'
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const packagingData = {
      amount: parseFloat(amount),
      unit,
      createdAt: new Date()
    };

    if (type === 'pack') {
      packagingData.packSize = parseInt(packSize);
      packagingData.packUnit = packUnit;
    }

    if (type === 'base') {
      item.basePackaging = packagingData;
    } else {
      item.packPackaging = packagingData;
    }

    await item.save();

    // Mark old history inactive
    await Packaging.updateMany({ itemId: id, type, isActive: true }, { isActive: false });

    // Add to history
    await Packaging.create({
      itemId: id,
      type,
      amount: parseFloat(amount),
      unit,
      isActive: true,
      createdBy: req.user.id,
      ...(type === 'pack' && {
        packSize: parseInt(packSize),
        packUnit
      })
    });

    res.status(200).json({
      success: true,
      message: 'Packaging updated successfully',
      data: item
    });
  } catch (error) {
    console.error('Update packaging error:', error);
    next(error);
  }
};

// @desc    Delete packaging
// @route   DELETE /api/items/:id/packaging/:type
// @access  Private
exports.deletePackaging = async (req, res, next) => {
  try {
    const { id, type } = req.params;

    if (!['base', 'pack'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid packaging type'
      });
    }

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (type === 'base') {
      item.basePackaging = undefined;
    } else {
      item.packPackaging = undefined;
    }

    await item.save();

    // Optional: also mark packaging history inactive
    await Packaging.updateMany({ itemId: id, type, isActive: true }, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Packaging deleted successfully'
    });
  } catch (error) {
    console.error('Delete packaging error:', error);
    next(error);
  }
};
