const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
      try {
            const { name, email, password, role } = req.body;

            // Check if user exists
            const userExists = await User.findUserByEmail(email);
            if (userExists) {
                  return res.status(400).json({ success: false, message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Default permissions for admin
            const permissions = role === 'admin' ? 'create,update,view,delete' : 'view';

            // Create user
            const userId = await User.create({
                  name,
                  email,
                  password: hashedPassword,
                  role,
                  permissions
            });

            const user = await User.findUserById(userId);

            res.status(201).json({
                  success: true,
                  data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: generateToken(user.id, user.role)
                  }
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
      try {
            const { email, password } = req.body;

            // Check for user
            const user = await User.findUserByEmail(email);
            if (!user) {
                  return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                  return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            res.status(200).json({
                  success: true,
                  data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions,
                        token: generateToken(user.id, user.role)
                  }
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
      try {
            const user = await User.findUserById(req.user.id);

            res.status(200).json({
                  success: true,
                  data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        permissions: user.permissions
                  }
            });
      } catch (err) {
            res.status(500).json({ success: false, message: 'Server Error' });
      }
};