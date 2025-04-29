// const checkAllPermissions = (requiredPermissions) => {
//       return (req, res, next) => {
//         if (!req.user) {
//           return res.status(401).json({ success: false, message: 'Not authenticated' });
//         }

//         if (req.user.role === 'admin') {
//           return next();
//         }

//         const requiredPerms = Array.isArray(requiredPermissions) 
//           ? requiredPermissions 
//           : [requiredPermissions];

//         const userPermissions = req.user.permissions 
//           ? req.user.permissions.split(',') 
//           : [];

//         const hasAllPermissions = requiredPerms.every(perm => 
//           userPermissions.includes(perm)
//         );

//         if (hasAllPermissions) {
//           return next();
//         }

//         return res.status(403).json({
//           success: false,
//           message: `You don't have all required permissions. Required: ${requiredPerms.join(' AND ')}`
//         });
//       };
//     };
const checkAllPermissions = (requiredPermissions) => {
      return (req, res, next) => {
            if (!req.user) {
                  return res.status(401).json({ success: false, message: 'Not authenticated' });
            }

            if (req.user.role === 'admin') {
                  return next();
            }

            const requiredPerms = Array.isArray(requiredPermissions)
                  ? requiredPermissions
                  : [requiredPermissions];

            const userPermissions = req.user.permissions
                  ? req.user.permissions.split(',')
                  : [];

            const hasAllPermissions = requiredPerms.every(perm =>
                  userPermissions.includes(perm)
            );

            if (hasAllPermissions) {
                  return next();
            }

            return res.status(403).json({
                  success: false,
                  message: `You don't have all required permissions. Required: ${requiredPerms.join(' AND ')}`
            });
      };
};
