import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your registered work email. For security, the response does not disclose whether an account exists."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
