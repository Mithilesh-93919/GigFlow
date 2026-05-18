import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router-dom';
import { registerFormSchema, RegisterFormValues } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/auth.store';
import { Input } from '../components/Input';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const Register: React.FC = () => {
  const { register: performRegister, isRegistering } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales',
    },
  });

  const selectedRole = watch('role');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data: RegisterFormValues) => {
    performRegister(data);
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
            Empower Your Sales Team
          </h1>
          <p className="text-lg text-blue-100 font-light">
            Collaborate, analyze, and convert leads together. Join today and streamline how your company manages active prospects.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} GigFlow Inc. All rights reserved.
        </div>
      </div>

      {/* Register Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* Mobile Brand Name */}
          <div className="lg:hidden mb-8">
            <span className="text-2xl font-extrabold text-blue-600">GigFlow</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Input
                {...register('name')}
                id="name"
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name}
                disabled={isRegistering}
                autoComplete="name"
              />

              <Input
                {...register('email')}
                id="email"
                type="email"
                label="Email address"
                placeholder="name@company.com"
                error={errors.email}
                disabled={isRegistering}
                autoComplete="email"
              />

              <Input
                {...register('password')}
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password}
                disabled={isRegistering}
                autoComplete="new-password"
              />

              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <span className="text-sm font-medium text-gray-700 block">
                  Select Your Role
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => setValue('role', 'sales')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 text-center",
                      selectedRole === 'sales'
                        ? "border-blue-500 bg-blue-50 text-blue-700 focus:ring-2 focus:ring-blue-500/20"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Sales Representative
                  </button>
                  <button
                    type="button"
                    disabled={isRegistering}
                    onClick={() => setValue('role', 'admin')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 text-center",
                      selectedRole === 'admin'
                        ? "border-blue-500 bg-blue-50 text-blue-700 focus:ring-2 focus:ring-blue-500/20"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    Administrator
                  </button>
                </div>
                {errors.role && (
                  <p className="text-xs font-medium text-red-500 animate-fadeIn" role="alert">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
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

export default Register;
