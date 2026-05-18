import { create } from 'zustand';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const getInitialAuth = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  
  if (token && user) {
    try {
      return { token, user: JSON.parse(user) as User, isAuthenticated: true };
    } catch {
      return { token: null, user: null, isAuthenticated: false };
    }
  }
  return { token: null, user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialAuth(),
  setAuth: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
