import { Suspense } from 'react';

import { AuthShell } from '@/components/auth/auth-shell';
import { VerifyEmailCard } from '@/components/auth/verify-email-card';

export default function VerifyEmailPage() {
  return (
    <AuthShell
      eyebrow="One final security step"
      title="Check your inbox"
      description="Email verification protects the integrity of enterprise scenarios and account-level decisions."
    >
      <Suspense
        fallback={
          <div className="h-72 animate-pulse rounded-2xl bg-[#f0f2ee]" />
        }
      >
        <VerifyEmailCard />
      </Suspense>
    </AuthShell>
  );
}
