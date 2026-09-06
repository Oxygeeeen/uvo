'use client';

import Image from 'next/image';
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';

type AccountProfile = {
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  jobTitle?: string;
  businessUnit?: string;
  location?: string;
  timezone?: string;
  weeklyBrief?: boolean;
  securityAlerts?: boolean;
  disruptionAlerts?: boolean;
  role?: string;
};

async function readApiResponse(response: Response) {
  const body = await response.text();
  if (!body) return {};
  try {
    return JSON.parse(body) as Record<string, unknown>;
  } catch {
    return {
      error: response.ok
        ? 'The server returned an unreadable response.'
        : 'The request failed before the server could return details.',
    };
  }
}

function getApiError(data: Record<string, unknown>, fallback: string) {
  return typeof data.error === 'string' ? data.error : fallback;
}

const initialProfile: AccountProfile = {
  name: '',
  email: '',
  emailVerified: false,
  jobTitle: '',
  businessUnit: '',
  location: '',
  timezone: 'Africa/Lagos',
  weeklyBrief: true,
  securityAlerts: true,
  disruptionAlerts: true,
  role: 'Analyst',
};

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'EA'
  );
}

export function AccountSettings() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<AccountProfile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  useEffect(() => {
    fetch('/api/account', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok)
          throw new Error('Unable to load account information.');
        return response.json();
      })
      .then((data) => setProfile({ ...initialProfile, ...data.user }))
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  function broadcast(next: AccountProfile) {
    window.dispatchEvent(
      new CustomEvent('profile-updated', {
        detail: { name: next.name, image: next.image, email: next.email },
      }),
    );
  }

  async function saveProfile(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await readApiResponse(response);
      if (!response.ok) {
        return setError(
          getApiError(data, 'Account settings could not be saved.'),
        );
      }
      const next = {
        ...profile,
        ...(data.user as Partial<AccountProfile>),
      };
      setProfile(next);
      broadcast(next);
      setMessage('Enterprise account settings saved.');
    } catch {
      setError('Account settings could not reach the server.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setMessage('');
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await fetch('/api/account/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await readApiResponse(response);
      if (!response.ok) {
        return setError(getApiError(data, 'Profile photo upload failed.'));
      }
      const next = { ...profile, image: String(data.image) };
      setProfile(next);
      broadcast(next);
      setMessage('Profile photo updated across the workspace.');
    } catch {
      setError('Profile photo upload could not reach the server.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function changePassword(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (passwords.next.length < 12)
      return setError('New passwords must contain at least 12 characters.');
    if (passwords.next !== passwords.confirm)
      return setError('New passwords do not match.');
    setSaving(true);
    const result = await authClient.changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.next,
      revokeOtherSessions: true,
    });
    setSaving(false);
    if (result.error)
      return setError(result.error.message || 'Password could not be changed.');
    setPasswords({ current: '', next: '', confirm: '' });
    setMessage('Password updated. Other active sessions were revoked.');
  }

  if (loading)
    return (
      <div className="grid min-h-[420px] place-items-center rounded-[20px] border border-[#e1e5df] bg-white">
        <LoaderCircle className="size-6 animate-spin text-[#0b5d54]" />
      </div>
    );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[22px] border border-[#dfe4de] bg-white shadow-[0_16px_44px_rgba(22,54,49,0.055)]">
        <div className="h-28 bg-[linear-gradient(120deg,#073b3a_0%,#0b665b_62%,#759b8c_100%)]" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:px-8">
          <div className="relative -mt-12 size-24 shrink-0 rounded-[24px] border-4 border-white bg-[#efe4cc] shadow-md">
            {profile.image ? (
              <Image
                src={profile.image}
                alt="Profile"
                width={96}
                height={96}
                unoptimized
                className="size-full rounded-[20px] object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center text-2xl font-bold text-[#5c481c]">
                {initials(profile.name)}
              </span>
            )}
            <button
              type="button"
              aria-label="Upload profile photo"
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-full border-2 border-white bg-[#0b5d54] text-white shadow-md hover:bg-[#084c45]"
            >
              {uploading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </button>
            <input
              ref={inputRef}
              className="hidden"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={uploadAvatar}
            />
          </div>
          <div className="min-w-0 flex-1 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-semibold tracking-[-0.02em] text-[#17302e]">
                {profile.name || 'Enterprise user'}
              </h2>
              {profile.emailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f5ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0a725d]">
                  <BadgeCheck className="size-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[#71807c]">
              {profile.jobTitle || 'Energy professional'} ·{' '}
              {profile.businessUnit || 'Nigeria Upstream'}
            </p>
          </div>
          <p className="rounded-full border border-[#e0e5df] bg-[#fafbf8] px-3 py-1.5 text-[11px] font-semibold text-[#64716e]">
            Role · {profile.role || 'Analyst'}
          </p>
        </div>
      </section>

      {(message || error) && (
        <output
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-medium ${error ? 'border-[#ebc8c2] bg-[#fff4f2] text-[#92483e]' : 'border-[#d7e8df] bg-[#eef8f2] text-[#0a6a58]'}`}
        >
          {error ? (
            <ShieldCheck className="size-4" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          {error || message}
        </output>
      )}

      <Tabs defaultValue="profile" className="panel gap-0">
        <TabsList
          variant="line"
          className="h-14 w-full justify-start gap-6 border-b border-[#e5e8e3] px-6 sm:px-8"
        >
          <TabsTrigger value="profile" className="flex-none px-0">
            Profile & organisation
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex-none px-0">
            Alerts & briefing
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-none px-0">
            Security
          </TabsTrigger>
        </TabsList>

        <form onSubmit={saveProfile}>
          <TabsContent value="profile" className="m-0 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="account-name">Full name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#89938f]" />
                  <Input
                    id="account-name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-email">Verified email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#89938f]" />
                  <Input
                    id="account-email"
                    value={profile.email}
                    disabled
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-title">Job title</Label>
                <Input
                  id="job-title"
                  value={profile.jobTitle}
                  onChange={(e) =>
                    setProfile({ ...profile, jobTitle: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  placeholder="e.g. Senior Data Analyst"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-unit">Business unit</Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#89938f]" />
                  <Input
                    id="business-unit"
                    value={profile.businessUnit}
                    onChange={(e) =>
                      setProfile({ ...profile, businessUnit: e.target.value })
                    }
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Office location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#89938f]" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Reporting timezone</Label>
                <select
                  id="timezone"
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile({ ...profile, timezone: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/Chicago">America/Chicago</option>
                  <option value="America/New_York">America/New York</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
              >
                {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
                {saving ? 'Saving…' : 'Save profile'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="m-0 p-6 sm:p-8">
            <div className="space-y-3">
              {[
                [
                  'weeklyBrief',
                  'Weekly executive brief',
                  'Receive a concise Monday view of production, exposure and decisions due.',
                ],
                [
                  'disruptionAlerts',
                  'Disruption and value alerts',
                  'Notify when modeled exposure breaches the executive threshold.',
                ],
                [
                  'securityAlerts',
                  'Security and access alerts',
                  'Receive alerts for password changes and significant account activity.',
                ],
              ].map(([field, title, detail]) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-5 rounded-2xl border border-[#e2e6e0] p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#203735]">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#788481]">
                      {detail}
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(profile[field as keyof AccountProfile])}
                    onCheckedChange={(checked) =>
                      setProfile({ ...profile, [field]: checked })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
              >
                {saving ? <LoaderCircle className="animate-spin" /> : <Save />}
                {saving ? 'Saving…' : 'Save preferences'}
              </Button>
            </div>
          </TabsContent>
        </form>

        <TabsContent value="security" className="m-0 p-6 sm:p-8">
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#dce8e1] bg-[#f2f8f4] p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#0b6a59]">
                <ShieldCheck className="size-4" />
                Identity status
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203735]">
                Email verified
              </p>
              <p className="mt-1 text-xs text-[#71807c]">{profile.email}</p>
            </div>
            <div className="rounded-2xl border border-[#e3e6e1] bg-[#fafbf8] p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#66736f]">
                <KeyRound className="size-4" />
                Session policy
              </p>
              <p className="mt-3 text-sm font-semibold text-[#203735]">
                8-hour secure session
              </p>
              <p className="mt-1 text-xs text-[#71807c]">
                Other sessions revoke after password change.
              </p>
            </div>
          </div>
          <form onSubmit={changePassword} className="max-w-2xl space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#89938f]" />
                <Input
                  id="current-password"
                  type="password"
                  required
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  className="h-11 rounded-xl pl-10"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="next-password">New password</Label>
                <Input
                  id="next-password"
                  type="password"
                  required
                  value={passwords.next}
                  onChange={(e) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  placeholder="12+ characters"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-next-password">
                  Confirm new password
                </Label>
                <Input
                  id="confirm-next-password"
                  type="password"
                  required
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={saving}
              variant="outline"
              className="rounded-xl"
            >
              {saving ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <KeyRound />
              )}
              {saving ? 'Updating…' : 'Update password & revoke other sessions'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
