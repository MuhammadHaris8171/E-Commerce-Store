const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

router.get('/', currencyController.getCurrencies);
router.post('/', currencyController.addCurrency);
router.put('/:id', currencyController.updateCurrency);
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;