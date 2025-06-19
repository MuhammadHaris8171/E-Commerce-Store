// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/brandController');

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
