import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { postResetPassword } from '../api/auth';
import { resetPasswordSchema, ResetPasswordFormData } from '../schemas/validation';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import PageLayout from '../components/PageLayout';
import FormContainer from '../components/FormContainer';
import LoadingButton from '../components/LoadingButton';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await postResetPassword({ token, password: data.password });

      toast.success('Password has been reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid or expired reset link</h2>
            <p className="text-gray-600 mb-6">The password reset link is invalid or has expired.</p>
            <a href="/forgot-password" className="btn-primary">
              Request new reset link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <BrandLogo icon="shield" subtitle="Set your new password" />

      <FormContainer footerLink={
        <a href="/login" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
          ← Back to login
        </a>
      }>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
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
            <p className="mt-2 text-sm text-gray-500">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <LoadingButton loading={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </LoadingButton>
        </form>
      </FormContainer>

      <Footer />
    </PageLayout>
  );
}
