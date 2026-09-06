import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  BarChart3,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Waves,
} from 'lucide-react';

const proofPoints = [
  { icon: BarChart3, label: 'Production variance', value: '1.670 mb/d' },
  { icon: CircleDollarSign, label: 'Value exposure', value: '$293m / mo' },
  { icon: TrendingUp, label: 'Recovery screen', value: '+63 kb/d' },
];

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-[#f3f3ee] p-3 sm:p-5 lg:p-7">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1480px] overflow-hidden rounded-[26px] border border-[#dee3dd] bg-white shadow-[0_35px_100px_rgba(11,54,50,0.13)] sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.06fr_0.94fr]">
        <section className="relative hidden overflow-hidden bg-[#073b3a] px-12 py-11 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-40 -top-32 size-[520px] rounded-full border border-white/8" />
          <div className="absolute -right-20 -top-6 size-[330px] rounded-full border border-white/8" />
          <div className="absolute bottom-[-160px] left-[-80px] size-[390px] rounded-full bg-[#0b6a5f]/35 blur-3xl" />
          <Link href="/login" className="relative flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[14px] bg-[#e4bd6e] text-[#17302e] shadow-lg shadow-black/10">
              <Waves className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[-0.01em]">
                Upstream Value Office
              </span>
              <span className="mt-0.5 block text-xs text-[#a8c8c1]">
                Nigeria portfolio
              </span>
            </span>
          </Link>

          <div className="relative max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#e4bd6e]">
              Enterprise decision intelligence
            </p>
            <h1 className="text-[44px] font-semibold leading-[1.08] tracking-[-0.045em]">
              Know where value is exposed. Decide where recovery comes first.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#b5cfca]">
              A governed command center for production performance, value at
              risk, recovery sequencing and external benchmark context.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-3">
              {proofPoints.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 backdrop-blur-sm"
                >
                  <item.icon className="mb-5 size-4 text-[#e4bd6e]" />
                  <p className="font-mono text-[15px] font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#8fb4ac]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-[#9cbdb6]">
            <ShieldCheck className="size-4 text-[#e4bd6e]" />
            Secure, verified access · Governed analytics · Auditable assumptions
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[470px]">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-[#073b3a] text-white">
                <Waves className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#17302e]">
                  Upstream Value Office
                </p>
                <p className="text-xs text-[#7c8985]">Nigeria portfolio</p>
              </div>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9a742c]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-[31px] font-semibold tracking-[-0.035em] text-[#17302e]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#71807c]">
              {description}
            </p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-center text-[11px] leading-5 text-[#8c9693]">
              Protected enterprise workspace · Administrative support:{' '}
              <a
                className="font-medium text-[#0b5d54] hover:underline"
                href="mailto:hello@scaleworkagency.com"
              >
                hello@scaleworkagency.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
