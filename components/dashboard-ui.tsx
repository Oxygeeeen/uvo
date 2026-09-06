import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#798582]">
          <span className="inline-block h-px w-6 bg-[#c49b48]" />
          {eyebrow}
        </div>
        <h1 className="text-[clamp(1.65rem,2.4vw,2.35rem)] font-semibold tracking-[-0.05em] text-[#102c2a]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#677572]">
          {description}
        </p>
      </div>
      {aside ? (
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {aside}
        </div>
      ) : null}
    </section>
  );
}

export function MetricCard({
  eyebrow,
  value,
  detail,
  trend,
  icon: Icon,
  accent = 'teal',
}: {
  eyebrow: string;
  value: string;
  detail: string;
  trend: string;
  icon: LucideIcon;
  accent?: 'teal' | 'amber' | 'blue' | 'rose';
}) {
  const tones = {
    teal: 'bg-[#e8f3ef] text-[#0d685a]',
    amber: 'bg-[#fbf0da] text-[#9a6510]',
    blue: 'bg-[#eaf0f5] text-[#365d7a]',
    rose: 'bg-[#f7e9e5] text-[#9b5140]',
  };
  return (
    <section className="metric-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="metric-eyebrow">{eyebrow}</p>
          <p className="mt-3 text-[1.72rem] font-semibold leading-none tracking-[-0.045em] text-[#152b2a]">
            {value}
          </p>
        </div>
        <div
          className={`grid size-9 shrink-0 place-items-center rounded-xl ${tones[accent]}`}
        >
          <Icon className="size-[17px]" />
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#eceee9] pt-3">
        <p className="text-[12px] text-[#76827f]">{detail}</p>
        <span
          className={`shrink-0 text-[12px] font-semibold ${accent === 'amber' || accent === 'rose' ? 'text-[#a5684d]' : 'text-[#0a7765]'}`}
        >
          {trend}
        </span>
      </div>
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  meta,
}: {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-[#e7eae5] px-5 py-5 sm:flex-row sm:items-start sm:px-6">
      <div>
        <h2 className="panel-title">{title}</h2>
        {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </div>
  );
}

export function StatusPill({
  children,
  tone = 'teal',
}: {
  children: ReactNode;
  tone?: 'teal' | 'amber' | 'rose' | 'gray' | 'blue';
}) {
  const tones = {
    teal: 'bg-[#e6f4ef] text-[#087361]',
    amber: 'bg-[#f7efdd] text-[#886923]',
    rose: 'bg-[#f7e7e2] text-[#a24f3e]',
    gray: 'bg-[#eef0ed] text-[#68736f]',
    blue: 'bg-[#e9f0f5] text-[#436981]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ChartLegend({
  items,
}: {
  items: Array<{ label: string; color: string; dashed?: boolean }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#687673]">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className={`h-0 w-5 border-t-2 ${item.dashed ? 'border-dashed' : ''}`}
            style={{ borderColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
