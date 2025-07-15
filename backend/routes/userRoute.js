const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { canCreate, canEdit, canDelete, canView, requireMasterAdmin } = require('../middleware/permissions');

// Auth routes
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.get('/profile', auth, userController.getProfile);
router.get('/permissions', auth, userController.getUserPermissions);

// User management routes (with permissions)
router.get('/', auth, canView, userController.getUsers);
router.post('/', auth, canCreate, userController.createUser);
router.put('/:id', auth, canEdit, userController.updateUser);
router.delete('/:id', auth, canDelete, userController.deleteUser);

module.exports = router;
