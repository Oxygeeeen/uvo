'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  BellRing,
  CircleDollarSign,
  Compass,
  Globe2,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  TrendingUp,
  UserRound,
} from 'lucide-react';

import { BrandMark } from '@/components/brand-mark';
import { ExecutiveBriefDialog } from '@/components/executive-brief-dialog';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

const publicRoutes = new Set([
  '/login',
  '/signup',
  '/verify-email',
  '/verified',
  '/forgot-password',
  '/reset-password',
]);

const decisionNav = [
  { label: 'Executive overview', icon: LayoutDashboard, href: '/' },
  { label: 'Production', icon: Activity, href: '/production' },
  { label: 'Value exposure', icon: CircleDollarSign, href: '/value-exposure' },
  {
    label: 'Recovery portfolio',
    icon: TrendingUp,
    href: '/recovery-portfolio',
  },
  { label: 'Global benchmark', icon: Globe2, href: '/global-benchmark' },
];

const controlNav = [
  { label: 'Assumptions', icon: ShieldAlert, href: '/assumptions' },
  { label: 'Source register', icon: Compass, href: '/sources' },
];

const routeMeta: Record<string, { title: string; context: string }> = {
  '/': { title: 'Executive overview', context: 'Enterprise decision cockpit' },
  '/production': {
    title: 'Production performance',
    context: 'Volumes, variance & outlook',
  },
  '/value-exposure': {
    title: 'Value exposure',
    context: 'Price, disruption & recovery economics',
  },
  '/recovery-portfolio': {
    title: 'Recovery portfolio',
    context: 'Actions, gates & accountability',
  },
  '/global-benchmark': {
    title: 'Global benchmark',
    context: 'Scale, peers & competitiveness',
  },
  '/assumptions': {
    title: 'Assumptions & governance',
    context: 'Model controls & assurance',
  },
  '/sources': {
    title: 'Source register',
    context: 'Lineage, freshness & definitions',
  },
  '/account': {
    title: 'Account information',
    context: 'Identity, preferences & security',
  },
};

type ShellUser = { name: string; email: string; image?: string | null };

function getInitials(name: string) {
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

function ProfileAvatar({
  user,
  compact = false,
}: {
  user: ShellUser;
  compact?: boolean;
}) {
  const size = compact ? 'size-9' : 'size-10';
  return user.image ? (
    <Image
      src={user.image}
      alt=""
      width={40}
      height={40}
      unoptimized
      className={`${size} shrink-0 rounded-full object-cover ring-1 ring-[#dce3dd]`}
    />
  ) : (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-full bg-[#efe4cc] text-xs font-bold text-[#5c481c]`}
    >
      {getInitials(user.name)}
    </span>
  );
}

function AppSidebar({ user }: { user: ShellUser }) {
  const pathname = usePathname();
  const renderNav = (items: typeof decisionNav) =>
    items.map((item) => {
      const isActive = pathname === item.href;
      return (
        <SidebarMenuItem key={item.href}>
          <Link
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            title={item.label}
            className={`flex h-10 items-center gap-2 overflow-hidden rounded-xl px-3 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#58a292] ${isActive ? 'bg-[#eaf2ee] font-semibold text-[#0c544c]' : 'text-[#53615f] hover:bg-[#f0f3ef] hover:text-[#294b46]'}`}
          >
            <item.icon className="size-[18px] shrink-0" />
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {item.label}
            </span>
          </Link>
        </SidebarMenuItem>
      );
    });

  async function signOut() {
    await authClient.signOut();
    window.location.assign('/login');
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-[#e6e7e1]">
      <SidebarHeader className="px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-3 overflow-hidden"
          aria-label="Nigeria Oil Value Command Center home"
        >
          <div className="grid h-10 w-[58px] shrink-0 place-items-center rounded-[12px] border border-[#e1e7e2] bg-white px-1.5 shadow-sm">
            <BrandMark className="w-full" priority />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[#102a2a]">
              Upstream Value Office
            </p>
            <p className="truncate text-xs text-[#75817f]">
              Nigerian Portfolio
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#89918e]">
            Decision room
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {renderNav(decisionNav)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#89918e]">
            Controls
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {renderNav(controlNav)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="m-3 gap-2 group-data-[collapsible=icon]:m-1">
        <Link
          href="/account"
          title="Account information"
          className={`flex items-center gap-3 overflow-hidden rounded-2xl border p-3 shadow-[0_8px_24px_rgba(14,54,48,0.04)] transition-colors group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:shadow-none ${pathname === '/account' ? 'border-[#cfded7] bg-[#edf5f1]' : 'border-[#e4e8e3] bg-white hover:bg-[#f7f9f6]'}`}
        >
          <ProfileAvatar user={user} compact />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold text-[#203332]">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-[#83908d]">
              Account information
            </p>
          </div>
          <UserRound className="size-4 shrink-0 text-[#7a8783] group-data-[collapsible=icon]:hidden" />
        </Link>
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          className="flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-[#6f7c79] transition-colors hover:bg-[#fff1ee] hover:text-[#a1463d] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

function Notifications() {
  const [read, setRead] = useState(false);
  const notices = [
    {
      title: 'Exposure threshold crossed',
      detail: 'Monthly gross value at risk is $293m at the planning price.',
      time: '4 min',
      tone: 'bg-[#d76553]',
    },
    {
      title: 'Recovery gate due',
      detail: 'Forcados evacuation workstream requires sponsor confirmation.',
      time: '42 min',
      tone: 'bg-[#d1a143]',
    },
    {
      title: 'Source register refreshed',
      detail: 'EIA price series passed the latest validation checks.',
      time: '2 hr',
      tone: 'bg-[#19856f]',
    },
    {
      title: 'Executive brief ready',
      detail: 'July close decision brief is available for secure download.',
      time: 'Today',
      tone: 'bg-[#547c95]',
    },
  ];

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Open notifications"
            className="relative rounded-xl bg-white"
          />
        }
      >
        <Bell />
        {!read && (
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[#d65a49] ring-2 ring-white" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(380px,calc(100vw-24px))] gap-0 overflow-hidden rounded-2xl p-0 shadow-[0_18px_55px_rgba(18,48,44,0.16)]"
      >
        <div className="flex items-center justify-between border-b border-[#e5e8e3] px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-[#203735]">
              Executive notifications
            </p>
            <p className="mt-0.5 text-[11px] text-[#7b8784]">
              Material changes and decisions due
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRead(true)}
            className="text-[11px] font-semibold text-[#0b665a] hover:underline"
          >
            Mark all read
          </button>
        </div>
        <div className="divide-y divide-[#edf0eb]">
          {notices.map((notice) => (
            <div
              key={notice.title}
              className="flex gap-3 px-4 py-3.5 hover:bg-[#fafbf8]"
            >
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${read ? 'bg-[#c8cfcb]' : notice.tone}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#233937]">
                  {notice.title}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#74817d]">
                  {notice.detail}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-[#919996]">
                {notice.time}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/recovery-portfolio"
          className="flex items-center justify-center gap-2 border-t border-[#e5e8e3] bg-[#fafbf8] px-4 py-3 text-xs font-semibold text-[#0b6257]"
        >
          <BellRing className="size-4" />
          Open decisions requiring attention
        </Link>
      </PopoverContent>
    </Popover>
  );
}

function ProtectedDashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profileOverride, setProfileOverride] = useState<Partial<ShellUser>>(
    {},
  );
  const meta = routeMeta[pathname] ?? routeMeta['/'];

  useEffect(() => {
    if (!isPending && !session)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isPending, pathname, router, session]);
  useEffect(() => {
    const listener = (event: Event) =>
      setProfileOverride((current) => ({
        ...current,
        ...(event as CustomEvent<Partial<ShellUser>>).detail,
      }));
    window.addEventListener('profile-updated', listener);
    return () => window.removeEventListener('profile-updated', listener);
  }, []);

  if (isPending || !session)
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f5f1]">
        <div className="flex items-center gap-3 text-sm font-medium text-[#5e6d69]">
          <span className="size-4 animate-spin rounded-full border-2 border-[#c7d5cf] border-t-[#0b5d54]" />
          Securing enterprise workspace…
        </div>
      </div>
    );

  const user: ShellUser = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    ...profileOverride,
  };

  return (
    <SidebarProvider
      open
      onOpenChange={() => undefined}
      style={{ '--sidebar-width': '15.75rem' } as React.CSSProperties}
    >
      <AppSidebar user={user} />
      <SidebarInset className="min-w-0 bg-[#f6f5f1]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#e5e6e1] bg-[#fbfaf7]/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger
              aria-label="Open navigation"
              className="md:hidden"
            />
            <div className="hidden h-5 w-px bg-[#dfe2dc] sm:block" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#253b39]">
                {meta.title}
              </p>
              <p className="truncate text-[11px] text-[#87918e]">
                {meta.context} · July 2026 close
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-[#dfe6df] bg-white px-3 py-1.5 text-xs font-medium text-[#536360] sm:flex">
              <span className="size-1.5 rounded-full bg-[#18a17f] shadow-[0_0_0_4px_rgba(24,161,127,0.12)]" />
              Model current
            </span>
            <Notifications />
            <ExecutiveBriefDialog />
          </div>
        </header>
        <main className="px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-[1500px]">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (publicRoutes.has(pathname)) return <>{children}</>;
  return <ProtectedDashboardShell>{children}</ProtectedDashboardShell>;
}
