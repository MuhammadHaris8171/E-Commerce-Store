const express = require('express');
const router = express.Router();
const departmentControllers = require('../controllers/departmentControllers');

router.get('/', departmentControllers.getDepartments);
router.post('/', departmentControllers.addDepartments);
router.put('/:id', departmentControllers.updateDepartments);
router.delete('/:id', departmentControllers.deleteDepartments);

module.exports = router;