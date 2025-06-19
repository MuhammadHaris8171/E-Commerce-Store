const express = require('express');
const router = express.Router();

const { getItemCategory, createItemCategory, updateItemCategory, deleteItemCategory } = require('../controllers/ItemCategoryController');

router.get('/',  getItemCategory);

router.post('/', createItemCategory);

router.put('/:id', updateItemCategory);

router.delete('/:id', deleteItemCategory);

module.exports = router;
