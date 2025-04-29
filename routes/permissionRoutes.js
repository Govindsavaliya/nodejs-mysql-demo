const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { protect, authorize } = require('../middleware/auth');

router.put('/:id', protect, authorize('admin'), permissionController.updatePermissions);

module.exports = router;