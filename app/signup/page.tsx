import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Request enterprise access"
      title="Create your account"
      description="Use a valid work address. A time-limited verification email is required before dashboard access is granted."
    >
      <SignupForm />
    </AuthShell>
  );
}
