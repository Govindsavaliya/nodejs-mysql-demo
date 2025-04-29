const db = require('../config/db');

// Create a new user
async function createUser({ name, email, password, role, permissions }) {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, role, permissions) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, role, permissions]
  );
  return result.insertId;
}

// Find user by email
async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// Find user by ID
async function findUserById(id) {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

// Update user permissions
async function updateUserPermissions(id, permissions) {
  await db.execute('UPDATE users SET permissions = ? WHERE id = ?', [permissions, id]);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPermissions
};