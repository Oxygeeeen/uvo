import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';

export default async function VerifiedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user.emailVerified) redirect('/login');

  return (
    <AuthShell
      eyebrow="Verification complete"
      title="Enterprise access confirmed"
      description="Your identity is verified and a confirmation has been sent to your email address."
    >
      <div className="rounded-[20px] border border-[#d9e8df] bg-[#f0f8f3] p-6">
        <div className="grid size-14 place-items-center rounded-2xl bg-white text-[#0b755f] shadow-sm">
          <BadgeCheck className="size-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#17302e]">
          Your decision workspace is ready.
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#657470]">
          Production, value exposure, recovery portfolio and source assurance
          screens are now available under your verified account.
        </p>
      </div>
      <Button
        className="mt-5 h-12 w-full rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
        render={<Link href="/" />}
        nativeButton={false}
      >
        <ArrowRight />
        Open command center
      </Button>
    </AuthShell>
  );
}
