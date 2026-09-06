'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  BadgeCheck,
  Boxes,
  Gauge,
  RadioTower,
  Target,
  TriangleAlert,
} from 'lucide-react';

import {
  ChartLegend,
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import {
  liquidSplit2026,
  productionSeries,
  terminals,
} from '@/lib/dashboard-data';

const terminalGap = terminals.reduce(
  (sum, terminal) => sum + Math.max(terminal.plan - terminal.jul, 0),
  0,
);

export default function ProductionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Production performance"
        title="Volumes, variance and forward outlook"
        description="A dedicated operating view of national liquids, crude–condensate mix, terminal contribution and the controls behind the 90-day forecast."
        aside={
          <>
            <StatusPill>National layer reported</StatusPill>
            <span className="filter-chip">All assets</span>
            <span className="filter-chip">kb/d · monthly</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="July combined liquids"
          value="1.670 mb/d"
          detail="Crude plus condensate"
          trend="−65 kb/d MoM"
          icon={Gauge}
        />
        <MetricCard
          eyebrow="Crude oil"
          value="1.505 mb/d"
          detail="90.1% of total liquids"
          trend="Quota: 100.3%"
          icon={Activity}
          accent="teal"
        />
        <MetricCard
          eyebrow="Condensate"
          value="165 kb/d"
          detail="9.9% of total liquids"
          trend="−10 kb/d MoM"
          icon={Boxes}
          accent="blue"
        />
        <MetricCard
          eyebrow="Modeled terminal gap"
          value={`${terminalGap.toFixed(0)} kb/d`}
          detail="Sample register vs allocations"
          trend="Needs reconciliation"
          icon={Target}
          accent="amber"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
        <section className="panel min-h-[450px]">
          <PanelHeader
            title="24-month production trajectory"
            subtitle="Reported history to July 2026 and a controlled base forecast through year-end."
            meta={
              <ChartLegend
                items={[
                  { label: 'Reported', color: '#087b69' },
                  { label: 'Base forecast', color: '#4f7790', dashed: true },
                  { label: 'Plan', color: '#bf9140', dashed: true },
                ]}
              />
            }
          />
          <div className="h-[360px] min-w-0 px-2 pb-4 pt-5 sm:px-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 900, height: 360 }}
            >
              <AreaChart
                data={productionSeries}
                margin={{ top: 8, right: 22, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="production-fill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0a806c" stopOpacity={0.24} />
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
                  interval={1}
                  tick={{ fill: '#7d8986', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  domain={[1.3, 1.9]}
                  ticks={[1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9]}
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
                  fill="url(#production-fill)"
                  dot={false}
                  connectNulls={false}
                />
                <Area
                  name="Base forecast"
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

        <section className="panel">
          <PanelHeader
            title="2026 liquids composition"
            subtitle="Reported crude and condensate contribution by month."
          />
          <div className="h-[300px] min-w-0 px-3 pt-5">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 420, height: 300 }}
            >
              <BarChart
                data={liquidSplit2026}
                margin={{ top: 8, right: 14, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="#ebeee9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 1.8]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 11 }}
                  width={38}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(3)} mb/d`]}
                />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 11, color: '#62716e' }}
                />
                <Bar
                  dataKey="crude"
                  name="Crude"
                  stackId="liquids"
                  fill="#117967"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="condensate"
                  name="Condensate"
                  stackId="liquids"
                  fill="#7ca79d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mx-5 mb-5 rounded-xl border border-[#e4e8e3] bg-[#f9faf8] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#84908d]">
              Mix signal
            </p>
            <p className="mt-2 text-sm font-semibold text-[#24413e]">
              July decline was concentrated in crude.
            </p>
            <p className="mt-1 text-xs leading-5 text-[#778480]">
              Use asset and outage evidence before assigning operational cause.
            </p>
          </div>
        </section>
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Terminal contribution and variance register"
          subtitle="Leading reported terminals plus clearly labeled modeled sample rows for portfolio planning."
          meta={<StatusPill tone="amber">Mixed evidence layer</StatusPill>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-[#e8ebe7] bg-[#fafbf9] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7d8985]">
                <th className="px-6 py-3">Terminal / stream</th>
                <th className="px-4 py-3">Operating class</th>
                <th className="px-4 py-3 text-right">Jun kb/d</th>
                <th className="px-4 py-3 text-right">Jul kb/d</th>
                <th className="px-4 py-3 text-right">MoM</th>
                <th className="px-4 py-3 text-right">Plan</th>
                <th className="px-4 py-3">Attainment</th>
                <th className="px-6 py-3">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {terminals.map((terminal) => {
                const change = terminal.jul - terminal.jun;
                const attainment = (terminal.jul / terminal.plan) * 100;
                return (
                  <tr
                    key={terminal.name}
                    className="text-xs text-[#536360] hover:bg-[#fafbf9]"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-[#203b38]">
                        {terminal.name}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#8a9692]">
                        {terminal.basin}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">{terminal.class}</td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      {terminal.jun.toFixed(1)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-[#1e4b45]">
                      {terminal.jul.toFixed(1)}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-mono font-semibold ${change >= 0 ? 'text-[#087361]' : 'text-[#a44f3e]'}`}
                    >
                      {change >= 0 ? '+' : ''}
                      {change.toFixed(1)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono">
                      {terminal.plan}
                    </td>
                    <td
                      className="px-4 py-3.5"
                      aria-label={`${attainment.toFixed(0)}% plan attainment`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8ebe7]">
                          <div
                            className={`h-full rounded-full ${attainment >= 95 ? 'bg-[#268573]' : attainment >= 90 ? 'bg-[#c1994e]' : 'bg-[#b86550]'}`}
                            style={{ width: `${Math.min(attainment, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px]">
                          {attainment.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusPill
                        tone={terminal.quality === 'Reported' ? 'teal' : 'gray'}
                      >
                        {terminal.quality}
                      </StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="panel p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#e7f2ee] text-[#137162]">
              <RadioTower className="size-4" />
            </div>
            <div>
              <h2 className="panel-title">Reconciliation controls</h2>
              <p className="panel-subtitle">Reporting assurance</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              'National total tied to July publication',
              'Crude and condensate definitions aligned',
              'Modeled rows excluded from reported total',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs text-[#5f6f6b]"
              >
                <BadgeCheck className="size-4 text-[#24806e]" />
                {item}
              </div>
            ))}
          </div>
        </section>
        <section className="panel p-5 sm:p-6">
          <h2 className="panel-title">Forecast drivers</h2>
          <p className="panel-subtitle">Conditions embedded in the base path</p>
          <div className="mt-5 space-y-4">
            {[
              {
                label: 'Operating uptime holds',
                value: 'Primary',
                tone: 'teal' as const,
              },
              {
                label: 'Planned restarts sequence',
                value: 'In plan',
                tone: 'blue' as const,
              },
              {
                label: 'No new major disruption',
                value: 'Watch',
                tone: 'amber' as const,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#edf0eb] pb-3 text-xs text-[#596a66]"
              >
                <span>{item.label}</span>
                <StatusPill tone={item.tone}>{item.value}</StatusPill>
              </div>
            ))}
          </div>
        </section>
        <section className="overflow-hidden rounded-[20px] bg-[#123b39] p-6 text-white">
          <TriangleAlert className="size-5 text-[#e0bb6b]" />
          <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em]">
            Variance is a signal, not a diagnosis.
          </h2>
          <p className="mt-3 text-xs leading-5 text-white/55">
            Public production movements cannot establish whether theft,
            maintenance, reservoir performance, scheduling or another factor
            caused the change. Asset evidence is required.
          </p>
        </section>
      </div>
    </>
  );
}
