'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import { CheckCircle2, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function ResetPasswordForm() {
  const token = useSearchParams().get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token)
      return setMessage(
        'This reset link is missing its secure token. Request a new one.',
      );
    if (password.length < 12) return setMessage('Use at least 12 characters.');
    if (password !== confirm) return setMessage('Passwords do not match.');
    setPending(true);
    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setPending(false);
    if (result.error)
      return setMessage(
        result.error.message || 'This reset link is invalid or expired.',
      );
    setComplete(true);
  }

  if (complete)
    return (
      <div className="rounded-2xl border border-[#dce9e2] bg-[#f0f8f3] p-6">
        <CheckCircle2 className="size-7 text-[#0b755f]" />
        <p className="mt-4 text-sm leading-6 text-[#536b65]">
          Your password has been updated securely.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-block font-semibold text-[#0b5d54] hover:underline"
        >
          Continue to sign in
        </Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-5">
      {message && (
        <div
          role="alert"
          className="rounded-xl bg-[#fff4f2] px-4 py-3 text-xs text-[#92483e]"
        >
          {message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-xl"
          placeholder="At least 12 characters"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password-confirm">Confirm password</Label>
        <Input
          id="new-password-confirm"
          type="password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="h-12 rounded-xl"
          placeholder="Repeat new password"
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
      >
        {pending && <LoaderCircle className="animate-spin" />}
        {pending ? 'Securing account…' : 'Set new password'}
      </Button>
    </form>
  );
}
