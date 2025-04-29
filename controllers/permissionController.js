const User = require('../models/User');

// @desc    Update user permissions (Admin only)
// @route   PUT /api/permissions/:id
// @access  Private/Admin
exports.updatePermissions = async (req, res) => {
      try {
            const { permissions } = req.body;
            const userId = req.params.id;

            await User.updateUserPermissions(userId, permissions);

            const user = await User.findById(userId);

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