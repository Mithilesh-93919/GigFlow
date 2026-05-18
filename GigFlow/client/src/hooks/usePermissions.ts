import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/auth';

export const usePermissions = () => {
  const user = useAuthStore((state) => state.user);

  const hasRole = (allowedRoles: UserRole | UserRole[]) => {
    if (!user) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  };

  return {
    isAdmin: user?.role === 'admin',
    isSales: user?.role === 'sales',
    hasRole,
    role: user?.role,
  };
};
