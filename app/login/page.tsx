import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Secure sign in"
      title="Welcome back"
      description="Sign in with your verified work email to enter the Nigeria Oil Value decision workspace."
    >
      <Suspense
        fallback={
          <div className="h-72 animate-pulse rounded-2xl bg-[#f0f2ee]" />
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
