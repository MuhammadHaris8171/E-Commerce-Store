const User = require('../models/User');

// Permission middleware
const requirePermission = (action) => {
  return async (req, res, next) => {
    try {
      // Get user from auth middleware
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has permission
      if (!user.hasPermission(action)) {
        return res.status(403).json({ 
          message: `Access denied. You don't have permission to ${action}.`,
          requiredPermission: action,
          userRole: user.role
        });
      }

      // Add user permissions to request for frontend use
      req.userPermissions = user.permissions;
      req.userRole = user.role;
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error checking permissions', error: error.message });
    }
  };
};

// Specific permission middlewares
const canCreate = requirePermission('canCreate');
const canEdit = requirePermission('canEdit');
const canDelete = requirePermission('canDelete');
const canView = requirePermission('canView');

// Master admin check
const requireMasterAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isMasterAdmin()) {
      return res.status(403).json({ 
        message: 'Access denied. Master admin privileges required.',
        userRole: user.role
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking master admin status', error: error.message });
  }
};

module.exports = {
  requirePermission,
  canCreate,
  canEdit,
  canDelete,
  canView,
  requireMasterAdmin
}; 