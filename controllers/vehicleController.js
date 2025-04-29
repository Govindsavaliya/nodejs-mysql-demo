const Vehicle = require('../models/Vehicle');
const path = require('path');
const fs = require('fs');

// Helper function to process uploaded files
const processUploadedFiles = (files, req) => {
      if (!files) return [];

      const images = Array.isArray(files.images) ? files.images : [files.images];

      return images.map(file => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${uniqueSuffix}-${file.name}`;
            const filePath = path.join('uploads', filename);
            file.mv(filePath);
            return `/uploads/${filename}`;
      });
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private
exports.createVehicle = async (req, res) => {
      try {
            const { name, color, category } = req.body;
            const images = processUploadedFiles(req.files, req);

            const vehicleId = await Vehicle.createVehicle({
                  name,
                  color,
                  category,
                  images,
                  createdBy: req.user.id
            });

            const vehicle = await Vehicle.getVehicleById(vehicleId);

            res.status(201).json({
                  success: true,
                  data: vehicle
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
      try {
            const vehicles = await Vehicle.getAllVehicles();

            // Map through vehicles and add full URL to images
            const vehiclesWithFullUrls = vehicles.map(vehicle => {
                  if (vehicle.images) {
                        const images = JSON.parse(vehicle.images).map(imagePath => {
                              return `${process.env.BASE_URL}${imagePath}`;
                        });
                        return { ...vehicle, images };
                  }
                  return vehicle;
            });

            res.status(200).json({
                  success: true,
                  data: vehiclesWithFullUrls
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};


// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
      try {
            const vehicle = await Vehicle.getVehicleById(req.params.id);

            if (!vehicle) {
                  return res.status(404).json({ success: false, message: 'Vehicle not found' });
            }

            // Add full URL to images if they exist
            if (vehicle.images) {
                  const images = JSON.parse(vehicle.images).map(imagePath => {
                        return `${process.env.BASE_URL}${imagePath}`;
                  });
                  vehicle.images = images;
            }

            res.status(200).json({
                  success: true,
                  data: vehicle
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};


// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res) => {
      try {
            const { name, color, category } = req.body;
            let images = [];

            if (req.files) {
                  // Delete old images
                  const vehicle = await Vehicle.getVehicleById(req.params.id);
                  if (vehicle.images) {
                        JSON.parse(vehicle.images).forEach(image => {
                              const filename = image.split('/').pop();
                              fs.unlinkSync(path.join('uploads', filename));
                        });
                  }

                  // Process new images
                  images = processUploadedFiles(req.files);
            }

            await Vehicle.updateVehicle(req.params.id, {
                  name,
                  color,
                  category,
                  images: images.length > 0 ? images : undefined
            });

            const updatedVehicle = await Vehicle.findById(req.params.id);

            res.status(200).json({ success: true, data: updatedVehicle });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res) => {
      try {
            const vehicle = await Vehicle.getVehicleById(req.params.id);

            if (!vehicle) {
                  return res.status(404).json({ success: false, message: 'Vehicle not found' });
            }

            // Delete associated images
            if (vehicle.images) {
                  JSON.parse(vehicle.images).forEach(image => {
                        const filename = image.split('/').pop();
                        fs.unlinkSync(path.join('uploads', filename));
                  });
            }

            await Vehicle.deleteVehicle(req.params.id);

            res.status(200).json({ success: true, data: {} });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};