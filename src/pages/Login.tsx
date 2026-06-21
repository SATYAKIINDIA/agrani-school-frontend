import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { loginSchema, LoginFormData } from '../schemas/validation';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import PageLayout from '../components/PageLayout';
import FormContainer from '../components/FormContainer';
import LoadingButton from '../components/LoadingButton';

export default function Login() {
  const [loginType, setLoginType] = useState('email');
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      console.log('🔐 Attempting login with:', { email: data.email });
      const response = await login(data);

      // Store memberships in localStorage for tenant selection
      if (response?.memberships) {
        localStorage.setItem('userMemberships', JSON.stringify(response.memberships));
      }

      // After successful login, redirect to tenant selection
      console.log('🚀 Redirecting to tenant selection');
      navigate('/select-tenant');
    } catch (err: any) {
      // Display error in form
      const errorMessage = err.response?.data?.message || 'Login failed';
      setLoginError(errorMessage);
      console.error('❌ Login error:', err);
    }
  };

  return (
    <PageLayout>
      <BrandLogo subtitle="Sign in to your account" />

      <FormContainer footerLink={
        <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
          Forgot your password?
        </a>
      }>
        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{loginError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Login Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'email'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                loginType === 'phone'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Phone
            </button>
          </div>

          {/* Email/Phone Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {loginType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              id="email"
              type={loginType === 'email' ? 'email' : 'tel'}
              {...register('email')}
              className="input-field"
              placeholder={loginType === 'email' ? 'you@example.com' : '+91 98765 43210'}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <LoadingButton loading={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </LoadingButton>
        </form>
      </FormContainer>

      <Footer />
    </PageLayout>
  );
}
