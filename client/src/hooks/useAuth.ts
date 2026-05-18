import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi, LoginFormValues, RegisterFormValues } from '../api/auth';
import { useAuthStore } from '../store/auth.store';
import axios from 'axios';

export const useAuth = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => authApi.login(data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success('Logged in successfully!');
      navigate('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = (error.response.data as { message?: string }).message || 'Login failed';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred during login');
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => authApi.register(data),
    onSuccess: (response) => {
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success('Registered successfully!');
      navigate('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const message = (error.response.data as { message?: string }).message || 'Registration failed';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred during registration');
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: () => {
      logoutStore();
      toast.success('Logged out successfully');
      navigate('/login');
    },
  };
};
