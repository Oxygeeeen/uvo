'use client';

import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Gauge,
  ShieldAlert,
  Target,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  PageHeader,
  MetricCard,
  PanelHeader,
  StatusPill,
  ChartLegend,
} from '@/components/dashboard-ui';
import {
  forecastScenarios,
  formatMoney,
  productionSeries,
  recoveryActions,
} from '@/lib/dashboard-data';

export default function ExecutiveOverview() {
  return (
    <>
      <PageHeader
        eyebrow="Executive overview"
        title="Where production value is exposed"
        description="A concise decision cockpit connecting current production, value exposure, delivery confidence and the interventions requiring executive attention."
        aside={
          <>
            <StatusPill tone="teal">July close reconciled</StatusPill>
            <span className="filter-chip">Nigeria · National</span>
            <span className="filter-chip">12-month view</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Combined liquids"
          value="1.670 mb/d"
          detail="July 2026 reported average"
          trend="−3.8% MoM"
          icon={Gauge}
        />
        <MetricCard
          eyebrow="Planning attainment"
          value="92.8%"
          detail="vs 1.80 mb/d executive case"
          trend="−130 kb/d"
          icon={Target}
          accent="amber"
        />
        <MetricCard
          eyebrow="90-day forecast"
          value="1.790 mb/d"
          detail="Base case · Oct 2026"
          trend="+120 kb/d"
          icon={BarChart3}
          accent="blue"
        />
        <MetricCard
          eyebrow="Gross value exposure"
          value="$293m / mo"
          detail="130 kb/d gap at $75/bbl"
          trend="Pre-take"
          icon={CircleDollarSign}
          accent="amber"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.58fr)_minmax(330px,0.62fr)]">
        <section className="panel min-h-[430px]">
          <PanelHeader
            title="Enterprise production pulse"
            subtitle="Reported combined liquids with the base forecast after July close."
            meta={
              <ChartLegend
                items={[
                  { label: 'Reported', color: '#087b69' },
                  { label: 'Forecast', color: '#4f7790', dashed: true },
                  { label: 'Plan', color: '#bf9140', dashed: true },
                ]}
              />
            }
          />
          <div className="h-[338px] min-w-0 px-2 pb-4 pt-5 sm:px-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 900, height: 338 }}
            >
              <AreaChart
                data={productionSeries.slice(5)}
                margin={{ top: 8, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="overview-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0a806c" stopOpacity={0.22} />
                    <stop
                      offset="100%"
                      stopColor="#0a806c"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#e9ece7"
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  domain={[1.35, 1.9]}
                  ticks={[1.4, 1.5, 1.6, 1.7, 1.8, 1.9]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 11 }}
                  width={42}
                  tickFormatter={(v) => Number(v).toFixed(1)}
                />
                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(3)} mb/d`,
                    'Output',
                  ]}
                />
                <ReferenceLine
                  y={1.8}
                  stroke="#bf9140"
                  strokeDasharray="4 4"
                  label={{
                    value: 'PLAN 1.80',
                    position: 'insideTopRight',
                    fill: '#96702e',
                    fontSize: 10,
                  }}
                />
                <Area
                  name="Reported"
                  type="monotone"
                  dataKey="actual"
                  stroke="#087b69"
                  strokeWidth={2.5}
                  fill="url(#overview-fill)"
                  connectNulls={false}
                  dot={{
                    r: 3,
                    fill: '#fff',
                    stroke: '#087b69',
                    strokeWidth: 2,
                  }}
                />
                <Area
                  name="Forecast"
                  type="monotone"
                  dataKey="forecast"
                  stroke="#4f7790"
                  strokeWidth={2.5}
                  strokeDasharray="6 5"
                  fill="transparent"
                  dot={{
                    r: 3,
                    fill: '#fff',
                    stroke: '#4f7790',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="overflow-hidden rounded-[20px] bg-[#0b3534] text-white shadow-[0_16px_42px_rgba(5,42,39,0.16)]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <StatusPill tone="amber">Executive brief</StatusPill>
              <span className="text-[11px] text-white/40">06 Sep 2026</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold tracking-[-0.035em]">
              Value protection is a near-term execution question.
            </h2>
          </div>
          <div className="space-y-5 px-6 py-6">
            <div className="flex gap-3">
              <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#e4bd68]/15 text-[#e4bd68]">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Secure the first 63 kb/d
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Evacuation uptime and maintenance sequencing screen at $1.55bn
                  annual gross value.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/8 text-white/70">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Hold the July floor</p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  The base case reaches 1.79 mb/d by October only if current
                  operating stability persists.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#c16f55]/15 text-[#dc8a70]">
                <ShieldAlert className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Assure before booking</p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Confirm causality, entitlement, spend and execution readiness
                  before recognizing value.
                </p>
              </div>
            </div>
            <Button
              render={<Link href="/recovery-portfolio" />}
              nativeButton={false}
              className="mt-2 h-10 w-full rounded-xl bg-[#e1b85e] text-[#17312f] hover:bg-[#eacb88]"
            >
              Open decision queue <ArrowRight />
            </Button>
          </div>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(330px,0.75fr)]">
        <section className="panel">
          <PanelHeader
            title="Decisions requiring sponsorship"
            subtitle="The items with the clearest near-term consequence for value and delivery."
            meta={
              <Link
                href="/recovery-portfolio"
                className="text-xs font-semibold text-[#176d61] hover:underline"
              >
                Full portfolio
              </Link>
            }
          />
          <div className="divide-y divide-[#edf0eb] px-5 sm:px-6">
            {recoveryActions.slice(0, 3).map((item) => (
              <div
                key={item.rank}
                className="grid gap-3 py-4 sm:grid-cols-[36px_minmax(0,1fr)_120px_110px] sm:items-center"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-[#edf3f0] text-xs font-bold text-[#24665b]">
                  {item.rank}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#233b38]">
                    {item.action}
                  </p>
                  <p className="mt-1 text-xs text-[#84918d]">
                    {item.owner} · {item.timing}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#8a9592]">
                    Potential
                  </p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#1a6157]">
                    +{item.volume} kb/d
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-[#8a9592]">
                    Confidence
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress
                      value={item.confidence}
                      className="h-1.5 bg-[#e7ebe7] [&_[data-slot=progress-indicator]]:bg-[#5a9286]"
                    />
                    <span className="text-[10px] text-[#6d7d79]">
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Q4 outcome envelope"
            subtitle="Probability-weighted planning scenarios, not commitments."
          />
          <div className="space-y-3 p-5 sm:p-6">
            {forecastScenarios.map((scenario) => (
              <div
                key={scenario.name}
                className="rounded-xl border border-[#e5e9e3] bg-[#fafbf9] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-[#445955]">
                    <span
                      className="size-2 rounded-full"
                      style={{ background: scenario.color }}
                    />
                    {scenario.name}
                  </span>
                  <span className="text-[11px] text-[#81908c]">
                    {scenario.probability}% weight
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-xl font-semibold tracking-[-0.04em] text-[#183532]">
                    {scenario.q4.toFixed(2)} mb/d
                  </p>
                  <p className="text-xs font-semibold text-[#8a6524]">
                    {scenario.valueRisk
                      ? `${formatMoney(scenario.valueRisk * 1_000_000_000)} risk`
                      : 'Above plan'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-4 grid gap-3 md:grid-cols-4">
        {[
          {
            label: 'OPEC crude quota',
            value: '100.3%',
            note: 'July crude only',
            icon: CheckCircle2,
            tone: 'text-[#147565] bg-[#e6f3ef]',
          },
          {
            label: 'Terminal watchlist',
            value: '4 streams',
            note: 'Below modeled plan',
            icon: TriangleAlert,
            tone: 'text-[#a36516] bg-[#f9efd9]',
          },
          {
            label: 'Data confidence',
            value: 'High',
            note: 'National reported layer',
            icon: ShieldAlert,
            tone: 'text-[#426c82] bg-[#eaf0f4]',
          },
          {
            label: 'Decision cycle',
            value: '14 days',
            note: 'Next portfolio review',
            icon: Clock3,
            tone: 'text-[#756130] bg-[#f3edde]',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[18px] border border-[#e1e5df] bg-white p-4"
          >
            <div
              className={`grid size-8 place-items-center rounded-lg ${item.tone}`}
            >
              <item.icon className="size-4" />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#84908d]">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#1d3936]">
              {item.value}
            </p>
            <p className="mt-0.5 text-[11px] text-[#87938f]">{item.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#ead8b4] bg-[#fffaf0] p-4 text-xs leading-5 text-[#776641]">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong className="text-[#54401c]">Scope guardrail:</strong> public
          production movement identifies where volumes changed; it does not
          independently establish theft, maintenance, reservoir performance or
          another cause.
        </p>
      </div>
    </>
  );
}
