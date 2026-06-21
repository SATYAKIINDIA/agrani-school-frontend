import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { postForgotPassword } from '../api/auth';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../schemas/validation';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import PageLayout from '../components/PageLayout';
import FormContainer from '../components/FormContainer';
import LoadingButton from '../components/LoadingButton';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await postForgotPassword(data);

      toast.success('Password reset link has been sent to your email');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    }
  };

  return (
    <PageLayout>
      <BrandLogo icon="key" subtitle="Reset your password" />

      <FormContainer footerLink={
        <a href="/login" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
          ← Back to login
        </a>
      }>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              We'll send a password reset link to your email
            </p>
          </div>

          <LoadingButton loading={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </LoadingButton>
        </form>
      </FormContainer>

      <Footer />
    </PageLayout>
  );
}
