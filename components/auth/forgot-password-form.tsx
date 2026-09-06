'use client';

import Link from 'next/link';
import { SyntheticEvent, useState } from 'react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo: '/reset-password',
    });
    setPending(false);
    setComplete(true);
  }

  return complete ? (
    <div className="rounded-2xl border border-[#dce9e2] bg-[#f0f8f3] p-6 text-sm leading-6 text-[#536b65]">
      If an account exists for{' '}
      <strong className="text-[#17302e]">{email}</strong>, a secure reset link
      is on its way.
      <Link
        href="/login"
        className="mt-5 flex items-center gap-2 font-semibold text-[#0b5d54] hover:underline"
      >
        <ArrowLeft className="size-4" />
        Return to sign in
      </Link>
    </div>
  ) : (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="recovery-email">Work email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
          <Input
            id="recovery-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="h-12 rounded-xl pl-10"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
      >
        {pending && <LoaderCircle className="animate-spin" />}
        {pending ? 'Sending secure link…' : 'Send password reset link'}
      </Button>
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0b5d54] hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </form>
  );
}
