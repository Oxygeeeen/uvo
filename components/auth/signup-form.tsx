'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';
import {
  ArrowRight,
  Check,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth-client';

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');

  const passwordChecks = [
    form.password.length >= 12,
    /[A-Z]/.test(form.password),
    /\d/.test(form.password),
  ];

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (form.password !== form.confirm)
      return setMessage('Passwords do not match.');
    if (!passwordChecks.every(Boolean))
      return setMessage(
        'Use at least 12 characters, one uppercase letter and one number.',
      );
    if (!accepted)
      return setMessage(
        'Accept the enterprise use and privacy terms to continue.',
      );

    setPending(true);
    const result = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      callbackURL: '/verified',
    });
    setPending(false);

    if (result.error) {
      setMessage(result.error.message || 'We could not create the account.');
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          role="alert"
          className="rounded-xl border border-[#ebc8c2] bg-[#fff4f2] px-4 py-3 text-xs leading-5 text-[#92483e]"
        >
          {message}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
          <Input
            id="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Your full name"
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Work email</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
          <Input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            placeholder="name@company.com"
            className="h-11 rounded-xl pl-10"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#88938f]" />
            <Input
              id="signup-password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              placeholder="12+ characters"
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm</Label>
          <Input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(event) =>
              setForm({ ...form, confirm: event.target.value })
            }
            placeholder="Repeat password"
            className="h-11 rounded-xl"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#7b8784]">
        {['12+ characters', 'Uppercase letter', 'Number'].map(
          (label, index) => (
            <span
              key={label}
              className={`flex items-center gap-1 ${passwordChecks[index] ? 'text-[#0b745f]' : ''}`}
            >
              <Check className="size-3" />
              {label}
            </span>
          ),
        )}
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-[#e3e7e1] bg-[#fafbf8] p-3 text-xs leading-5 text-[#64716e]">
        <Checkbox
          id="enterprise-terms"
          checked={accepted}
          onCheckedChange={(value) => setAccepted(value === true)}
          className="mt-0.5"
        />
        <label htmlFor="enterprise-terms" className="cursor-pointer">
          I accept the enterprise acceptable-use, information security and
          privacy terms.
        </label>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
      >
        {pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
        {pending ? 'Creating secure account…' : 'Create and verify account'}
      </Button>
      <p className="text-center text-sm text-[#75817e]">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#0b5d54] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
