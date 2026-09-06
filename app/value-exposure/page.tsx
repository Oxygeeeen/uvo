'use client';

import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Calculator,
  CalendarClock,
  CircleDollarSign,
  Droplets,
  Gauge,
  ShieldCheck,
} from 'lucide-react';

import {
  ChartLegend,
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import {
  brentSeries,
  formatMoney,
  GAP_KBD,
  terminals,
} from '@/lib/dashboard-data';

type ScenarioInput = {
  recoveryKbd: number;
  oilPrice: number;
  realization: number;
  disruptionDays: number;
};
type ToolContext = {
  registerTool?: (
    tool: unknown,
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

function calculateAnnualValue(input: ScenarioInput) {
  const availability = Math.max(0, 365 - input.disruptionDays) / 365;
  return (
    input.recoveryKbd *
    1000 *
    input.oilPrice *
    365 *
    (input.realization / 100) *
    availability
  );
}

export default function ValueExposurePage() {
  const [recoveryKbd, setRecoveryKbd] = useState(63);
  const [oilPrice, setOilPrice] = useState(75);
  const [realization, setRealization] = useState(90);
  const [disruptionDays, setDisruptionDays] = useState(12);

  const scenario = useMemo(
    () => ({ recoveryKbd, oilPrice, realization, disruptionDays }),
    [recoveryKbd, oilPrice, realization, disruptionDays],
  );
  const annualValue = calculateAnnualValue(scenario);
  const monthlyValue = annualValue / 12;
  const residualGap = Math.max(GAP_KBD - recoveryKbd * (realization / 100), 0);
  const monthlyRisk = residualGap * 1000 * oilPrice * 30;

  useEffect(() => {
    const context = (document as Document & { modelContext?: ToolContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = context.registerTool(
      {
        name: 'configure_recovery_scenario',
        title: 'Configure recovery scenario',
        description:
          'Stage an executive recovery case by updating recoverable volume, oil price, realization and disruption days in the visible value simulator.',
        inputSchema: {
          type: 'object',
          properties: {
            recoveryKbd: {
              type: 'number',
              minimum: 0,
              maximum: 150,
              description: 'Recoverable thousand barrels per day.',
            },
            oilPrice: {
              type: 'number',
              minimum: 40,
              maximum: 140,
              description: 'Oil price in US dollars per barrel.',
            },
            realization: {
              type: 'number',
              minimum: 50,
              maximum: 100,
              description: 'Expected realization percentage.',
            },
            disruptionDays: {
              type: 'number',
              minimum: 0,
              maximum: 60,
              description: 'Expected annual disruption days.',
            },
          },
          required: [
            'recoveryKbd',
            'oilPrice',
            'realization',
            'disruptionDays',
          ],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        async execute(input: unknown) {
          const next = input as Partial<ScenarioInput>;
          const isValid =
            typeof next.recoveryKbd === 'number' &&
            next.recoveryKbd >= 0 &&
            next.recoveryKbd <= 150 &&
            typeof next.oilPrice === 'number' &&
            next.oilPrice >= 40 &&
            next.oilPrice <= 140 &&
            typeof next.realization === 'number' &&
            next.realization >= 50 &&
            next.realization <= 100 &&
            typeof next.disruptionDays === 'number' &&
            next.disruptionDays >= 0 &&
            next.disruptionDays <= 60;
          if (!isValid)
            throw new Error(
              'Scenario inputs fall outside the supported operating ranges.',
            );
          const valid = next as ScenarioInput;
          flushSync(() => {
            setRecoveryKbd(valid.recoveryKbd);
            setOilPrice(valid.oilPrice);
            setRealization(valid.realization);
            setDisruptionDays(valid.disruptionDays);
          });
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
          return {
            status: 'staged',
            inputs: valid,
            annualGrossValue: Math.round(calculateAnnualValue(valid)),
          };
        },
      },
      { signal: lifecycle.signal },
    );
    void Promise.resolve(register).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  const sensitivity = [60, 75, 90].map((price) => ({
    price,
    values: [35, 63, 100].map((volume) =>
      calculateAnnualValue({
        recoveryKbd: volume,
        oilPrice: price,
        realization,
        disruptionDays,
      }),
    ),
  }));
  const exposureByTerminal = terminals
    .slice(0, 8)
    .map((terminal) => ({
      name: terminal.name,
      exposure:
        (Math.max(terminal.plan - terminal.jul, 0) * 1000 * oilPrice * 30) /
        1_000_000,
    }))
    .sort((a, b) => b.exposure - a.exposure);

  return (
    <>
      <PageHeader
        eyebrow="Value exposure"
        title="Price, disruption and recovery economics"
        description="Translate recoverable barrels into decision-grade gross value, test sensitivities and keep the commercial bridge explicit before value is booked."
        aside={
          <>
            <StatusPill tone="amber">Scenario workspace</StatusPill>
            <span className="filter-chip">USD · gross basis</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Current gross exposure"
          value="$293m / mo"
          detail="130 kb/d at $75/bbl"
          trend="Before entitlement"
          icon={CircleDollarSign}
          accent="amber"
        />
        <MetricCard
          eyebrow="Scenario annual value"
          value={formatMoney(annualValue)}
          detail={`${recoveryKbd} kb/d recovery case`}
          trend={`${realization}% realized`}
          icon={Calculator}
        />
        <MetricCard
          eyebrow="Scenario monthly uplift"
          value={formatMoney(monthlyValue)}
          detail={`${365 - disruptionDays} productive days`}
          trend={`$${oilPrice}/bbl`}
          icon={Droplets}
          accent="blue"
        />
        <MetricCard
          eyebrow="Residual monthly risk"
          value={formatMoney(monthlyRisk)}
          detail={`${residualGap.toFixed(1)} kb/d residual gap`}
          trend={`${((1 - residualGap / GAP_KBD) * 100).toFixed(0)}% closed`}
          icon={Gauge}
          accent={residualGap > 65 ? 'rose' : 'teal'}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(390px,0.78fr)_minmax(0,1.22fr)]">
        <section className="overflow-hidden rounded-[20px] bg-[#0c3937] text-white shadow-[0_18px_46px_rgba(5,42,39,0.16)]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#e4c276]">
                  Executive simulator
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                  Stage a recovery case
                </h2>
              </div>
              <StatusPill tone="teal">Live</StatusPill>
            </div>
          </div>
          <div className="space-y-6 px-6 py-6">
            <ScenarioSlider
              label="Recoverable volume"
              value={recoveryKbd}
              min={0}
              max={150}
              step={1}
              suffix="kb/d"
              onChange={setRecoveryKbd}
            />
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium text-white/65">Oil price</p>
                <span className="font-mono text-sm font-semibold">
                  ${oilPrice}/bbl
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[60, 75, 90].map((price) => (
                  <button
                    key={price}
                    onClick={() => setOilPrice(price)}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${oilPrice === price ? 'border-[#e2be6e] bg-[#e2be6e] text-[#163330]' : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10'}`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
            </div>
            <ScenarioSlider
              label="Value realization"
              value={realization}
              min={50}
              max={100}
              step={1}
              suffix="%"
              onChange={setRealization}
            />
            <ScenarioSlider
              label="Annual disruption"
              value={disruptionDays}
              min={0}
              max={60}
              step={1}
              suffix="days"
              onChange={setDisruptionDays}
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-white/45">
                Modeled annual gross value
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#f0cc7c]">
                {formatMoney(annualValue)}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/48">
                Illustrative gross value before royalty, tax, entitlement,
                operating cost, capex, grade differentials and schedule risk.
              </p>
            </div>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Brent price context"
            subtitle="EIA monthly Europe Brent spot price; used to frame, not predict, scenario choices."
            meta={
              <ChartLegend
                items={[
                  { label: 'Brent spot', color: '#4f7790' },
                  { label: 'Base case', color: '#c29642', dashed: true },
                ]}
              />
            }
          />
          <div className="h-[355px] min-w-0 px-2 pb-4 pt-5 sm:px-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 780, height: 355 }}
            >
              <AreaChart
                data={brentSeries}
                margin={{ top: 8, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="brent-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f7790" stopOpacity={0.28} />
                    <stop
                      offset="100%"
                      stopColor="#4f7790"
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
                  domain={[40, 125]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 11 }}
                  width={42}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toFixed(2)}/bbl`,
                    'Brent',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#4f7790"
                  strokeWidth={2.5}
                  fill="url(#brent-fill)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3 border-t border-[#e7eae5] p-5 sm:grid-cols-3 sm:px-6">
            {[
              { label: 'Downside', value: '$60', note: 'Stress case' },
              { label: 'Planning base', value: '$75', note: 'Executive case' },
              { label: 'Upside', value: '$90', note: 'Opportunity case' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => setOilPrice(Number(item.value.slice(1)))}
                className={`rounded-xl border p-3 text-left transition hover:border-[#aebcb7] ${oilPrice === Number(item.value.slice(1)) ? 'border-[#78a79c] bg-[#f0f7f4]' : 'border-[#e3e7e2] bg-[#fafbf9]'}`}
              >
                <p className="text-[10px] uppercase tracking-[0.08em] text-[#85908d]">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-[#25423e]">
                  {item.value}
                  <span className="text-[10px] font-normal text-[#85918e]">
                    {' '}
                    /bbl
                  </span>
                </p>
                <p className="text-[10px] text-[#87928f]">{item.note}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="panel">
          <PanelHeader
            title="Price × recovery sensitivity"
            subtitle="Annual gross value at the current realization and disruption settings."
          />
          <div className="overflow-x-auto p-5 sm:p-6">
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.08em] text-[#84908d]">
                  <th className="pb-3">Oil price</th>
                  <th className="pb-3 text-right">35 kb/d</th>
                  <th className="pb-3 text-right">63 kb/d</th>
                  <th className="pb-3 text-right">100 kb/d</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9ece7]">
                {sensitivity.map((row) => (
                  <tr key={row.price} className="text-xs">
                    <td className="py-4 font-semibold text-[#314b47]">
                      ${row.price}/bbl
                    </td>
                    {row.values.map((value, index) => (
                      <td
                        key={index}
                        className={`py-4 text-right font-mono font-semibold ${row.price === oilPrice && [35, 63, 100][index] === recoveryKbd ? 'text-[#b17b21]' : 'text-[#17695e]'}`}
                      >
                        {formatMoney(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <PanelHeader
            title="Modeled exposure concentration"
            subtitle="Monthly gross gap value by terminal sample at the selected price."
          />
          <div className="h-[260px] min-w-0 px-3 py-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 660, height: 260 }}
            >
              <BarChart
                data={exposureByTerminal}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 12, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#edf0eb" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#7d8986', fontSize: 10 }}
                  tickFormatter={(v) => `$${v}m`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#54635f', fontSize: 10 }}
                  width={74}
                />
                <Tooltip
                  formatter={(value) => [
                    `$${Number(value).toFixed(1)}m/month`,
                    'Exposure',
                  ]}
                />
                <Bar dataKey="exposure" radius={[0, 5, 5, 0]}>
                  {exposureByTerminal.map((entry, index) => (
                    // oxlint-disable-next-line typescript/no-deprecated -- Recharts Cell is the supported per-datum color API.
                    <Cell
                      key={entry.name}
                      fill={index < 3 ? '#b9704f' : '#c9a45a'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Gross-to-decision-value bridge"
          subtitle="The commercial and delivery adjustments required before an opportunity can be carried as assured value."
          meta={<StatusPill tone="blue">Governance control</StatusPill>}
        />
        <div className="grid gap-0 md:grid-cols-5">
          {[
            {
              step: '1',
              label: 'Gross recovered barrels',
              note: 'Simulator output',
              icon: Droplets,
            },
            {
              step: '2',
              label: 'Price & grade realization',
              note: 'Differentials / losses',
              icon: CircleDollarSign,
            },
            {
              step: '3',
              label: 'Entitlement & fiscal take',
              note: 'JV / PSC economics',
              icon: ShieldCheck,
            },
            {
              step: '4',
              label: 'Cost and capital',
              note: 'Opex / capex / logistics',
              icon: Calculator,
            },
            {
              step: '5',
              label: 'Schedule-risked value',
              note: 'Stage-gated decision basis',
              icon: CalendarClock,
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`relative p-5 sm:p-6 ${index < 4 ? 'border-b border-[#e8ebe7] md:border-b-0 md:border-r' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-lg bg-[#eaf2ee] text-xs font-bold text-[#176a5e]">
                  {item.step}
                </span>
                <item.icon className="size-4 text-[#8a9692]" />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#28433f]">
                {item.label}
              </p>
              <p className="mt-1 text-xs text-[#84908d]">{item.note}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ScenarioSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="text-xs font-medium text-white/65">{label}</label>
        <span className="font-mono text-sm font-semibold">
          {value} {suffix}
        </span>
      </div>
      <input
        aria-label={label}
        className="scenario-range"
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="mt-1 flex justify-between text-[9px] text-white/30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
