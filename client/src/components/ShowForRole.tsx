import React from 'react';
import { UserRole } from '../types/auth';
import { usePermissions } from '../hooks/usePermissions';

interface ShowForRoleProps {
  roles: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ShowForRole: React.FC<ShowForRoleProps> = ({ roles, children, fallback = null }) => {
  const { hasRole } = usePermissions();

  if (hasRole(roles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
