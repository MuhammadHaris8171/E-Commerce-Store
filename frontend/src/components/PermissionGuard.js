import React from 'react';
import { useAuth } from '../context/AuthContext';

const PermissionGuard = ({ 
  children, 
  requirePermission, 
  requireMasterAdmin = false,
  fallback = null 
}) => {
  const { hasPermission, isMasterAdmin } = useAuth();

  // Check if user is master admin
  if (requireMasterAdmin && !isMasterAdmin()) {
    return fallback;
  }

  // Check specific permission
  if (requirePermission && !hasPermission(requirePermission)) {
    return fallback;
  }

  // If no specific requirements, just check if user is logged in
  if (!hasPermission('canView')) {
    return fallback;
  }

  return children;
};

// Specific permission components
export const CanCreate = ({ children, fallback = null }) => (
  <PermissionGuard requirePermission="canCreate" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanEdit = ({ children, fallback = null }) => (
  <PermissionGuard requirePermission="canEdit" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanDelete = ({ children, fallback = null }) => (
  <PermissionGuard requirePermission="canDelete" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const CanView = ({ children, fallback = null }) => (
  <PermissionGuard requirePermission="canView" fallback={fallback}>
    {children}
  </PermissionGuard>
);

export const MasterAdminOnly = ({ children, fallback = null }) => (
  <PermissionGuard requireMasterAdmin={true} fallback={fallback}>
    {children}
  </PermissionGuard>
);

export default PermissionGuard; 