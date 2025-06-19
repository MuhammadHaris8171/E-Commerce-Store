const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');

router.get('/', unitController.getUnit);
router.post('/', unitController.addUnit);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);

module.exports = router;