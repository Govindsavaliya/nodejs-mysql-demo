const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const checkPermission = require('../middleware/permission');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

// single create permission
router.post(
      '/',
      protect,
      checkPermission('create'),
      vehicleController.createVehicle
);

// multiple create permission

// router.post(
//   '/',
//   protect,
//   checkPermission(['create', 'update']),
//   vehicleController.createVehicle
// );

router.get(
      '/',
      protect,
      checkPermission('view'),
      vehicleController.getVehicles
);

router.get(
      '/:id',
      protect,
      checkPermission('view'),
      vehicleController.getVehicle
);

router.put(
      '/:id',
      protect,
      checkPermission('update'),
      vehicleController.updateVehicle
);

router.delete(
      '/:id',
      protect,
      checkPermission('delete'),
      vehicleController.deleteVehicle
);

module.exports = router;