import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router-dom';
import { loginFormSchema, LoginFormValues } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';
import { Input } from '../components/Input';
import { Loader2, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Brand Sidebar (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-400 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10">
          <span className="text-2xl font-bold tracking-tight">GigFlow</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight leading-none sm:text-5xl">
            Supercharge Your Sales Pipeline
          </h1>
          <p className="text-lg text-blue-100 font-light">
            Keep track of leads, track interactions, and scale your sales conversions effortlessly with modern CRM tools.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} GigFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* Mobile Brand Name */}
          <div className="lg:hidden mb-8">
            <span className="text-2xl font-extrabold text-blue-600">GigFlow</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="text-sm font-medium text-gray-500">
              New to GigFlow?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <Input
                {...register('email')}
                id="email"
                type="email"
                label="Email address"
                placeholder="name@company.com"
                error={errors.email}
                disabled={isLoggingIn}
                autoComplete="email"
              />

              <div className="space-y-1">
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password}
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                />
                <ul className="text-xs text-gray-500 list-disc list-inside mt-1 ml-1">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one number</li>
                </ul>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
