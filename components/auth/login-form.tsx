'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage('');

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: searchParams.get('next') || '/',
    });

    setPending(false);
    if (result.error) {
      const needsVerification = result.error.code === 'EMAIL_NOT_VERIFIED';
      setMessage(
        needsVerification
          ? 'Your email still needs verification. We sent a fresh secure link.'
          : result.error.message ||
              'We could not sign you in. Check your details.',
      );
      if (needsVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
      return;
    }

    router.push(searchParams.get('next') || '/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div
          role="alert"
          className="rounded-xl border border-[#ead8b2] bg-[#fff9eb] px-4 py-3 text-xs leading-5 text-[#76591f]"
        >
          {message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="h-12 rounded-xl pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#0b655b] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="h-12 rounded-xl px-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#7d8985] hover:bg-[#eef1ed]"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
        {pending ? 'Authenticating…' : 'Continue to command center'}
      </Button>
      <p className="text-center text-sm text-[#75817e]">
        New to the workspace?{' '}
        <Link
          href="/signup"
          className="font-semibold text-[#0b5d54] hover:underline"
        >
          Create enterprise account
        </Link>
      </p>
    </form>
  );
}
