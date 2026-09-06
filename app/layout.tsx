import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nigeria Oil Value Command Center',
  description:
    'Executive view of Nigerian oil production, value exposure, recovery priorities and global benchmarks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
