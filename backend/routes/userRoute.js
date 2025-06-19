const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.post('/login', userController.login);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
