const db = require('../config/db');

// Create a new vehicle
async function createVehicle({ name, color, category, images, createdBy }) {
      const [result] = await db.execute(
            'INSERT INTO vehicles (name, color, category, images, created_by) VALUES (?, ?, ?, ?, ?)',
            [name, color, category, JSON.stringify(images), createdBy]
      );
      return result.insertId;
}

// Get all vehicles
async function getAllVehicles() {
      const [rows] = await db.execute('SELECT * FROM vehicles');
      return rows;
}

// Get vehicle by ID
async function getVehicleById(id) {
      const [rows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
      return rows[0];
}

// Update vehicle
async function updateVehicle(id, { name, color, category, images }) {
      await db.execute(
            'UPDATE vehicles SET name = ?, color = ?, category = ?, images = ? WHERE id = ?',
            [name, color, category, JSON.stringify(images), id]
      );
}

async function deleteVehicle(id) {
      await db.execute('DELETE FROM vehicles WHERE id = ?', [id]);
}

module.exports = {
      createVehicle,
      getAllVehicles,
      getVehicleById,
      updateVehicle,
      deleteVehicle
};