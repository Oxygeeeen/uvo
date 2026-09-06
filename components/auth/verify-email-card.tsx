'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CheckCircle2, LoaderCircle, MailCheck, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  async function resend() {
    if (!email)
      return setMessage('Return to sign up and enter your work email.');
    setPending(true);
    setMessage('');
    const result = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/verified',
    });
    setPending(false);
    if (result.error)
      return setMessage(
        result.error.message || 'We could not resend the email.',
      );
    setSent(true);
  }

  return (
    <div>
      <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-[#e7f3ee] text-[#0b6d5e]">
        <MailCheck className="size-7" />
      </div>
      <div className="rounded-2xl border border-[#e1e6e0] bg-[#fafbf8] p-5">
        <p className="text-sm leading-6 text-[#566562]">
          We sent a secure verification link to
        </p>
        <p className="mt-1 break-all font-semibold text-[#17302e]">
          {email || 'your work email address'}
        </p>
      </div>
      <ol className="my-6 space-y-3 text-sm text-[#62706d]">
        {[
          'Open the message from the Upstream Value Office.',
          'Select “Verify and continue” within 60 minutes.',
          'Return automatically to your confirmed workspace.',
        ].map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#eef2ee] text-[11px] font-bold text-[#0b5d54]">
              {index + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
      {sent && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-[#eaf5ef] px-4 py-3 text-xs font-medium text-[#0a6a58]">
          <CheckCircle2 className="size-4" />A fresh verification email has been
          sent.
        </p>
      )}
      {message && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-[#fff4f2] px-4 py-3 text-xs text-[#92483e]"
        >
          {message}
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={resend}
        disabled={pending}
        className="h-11 w-full rounded-xl"
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
        {pending ? 'Sending…' : 'Resend verification email'}
      </Button>
      <p className="mt-5 text-center text-sm text-[#75817e]">
        Already verified?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#0b5d54] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
