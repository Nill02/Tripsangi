/**
 * Permission-based access control
 * Used by Super Admin to allow / deny admin modules
 */

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Super Admin has all permissions
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Admin permission check
    if (req.user.permissions && req.user.permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      message: 'Permission denied',
      requiredPermission: permission,
    });
  };
};
 