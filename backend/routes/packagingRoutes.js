// routes/packagingRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPackagingByItemId,
  getPackagingHistory,
  addPackaging,
  updatePackaging,
  deletePackaging
} = require('../controllers/packagingController');

router.get('/:id/history', getPackagingHistory);      // e.g., /packaging/123/history
router.get('/:id', getPackagingByItemId);             // e.g., /packaging/123

router.post('/:id', addPackaging);
router.put('/:id', updatePackaging);
router.delete('/:id/:type', deletePackaging);         // e.g., /packaging/123/base

module.exports = router;
