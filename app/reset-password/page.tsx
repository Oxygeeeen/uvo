import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure account recovery"
      title="Choose a new password"
      description="Create a strong password that is unique to this enterprise workspace."
    >
      <Suspense
        fallback={
          <div className="h-52 animate-pulse rounded-2xl bg-[#f0f2ee]" />
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
