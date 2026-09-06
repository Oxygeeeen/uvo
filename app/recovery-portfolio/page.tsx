'use client';

import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import {
  BadgeDollarSign,
  CheckCircle2,
  CircleDot,
  Flag,
  ShieldAlert,
  Target,
  UsersRound,
} from 'lucide-react';

import {
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import { recoveryActions } from '@/lib/dashboard-data';

const gatedVolume = recoveryActions
  .filter((item) => item.confidence >= 65)
  .reduce((sum, item) => sum + item.volume, 0);
const totalValue = recoveryActions.reduce((sum, item) => sum + item.value, 0);

const milestones = [
  {
    window: '0–30 days',
    title: 'Mobilize',
    detail: 'Confirm owners, causal evidence and intervention scopes.',
    actions: 'Actions 1–2',
  },
  {
    window: '30–90 days',
    title: 'Stabilize',
    detail: 'Deliver evacuation and maintenance sequencing outcomes.',
    actions: '63 kb/d screen',
  },
  {
    window: '3–8 months',
    title: 'Optimize',
    detail: 'Well and facility campaigns move through execution gates.',
    actions: '40 kb/d screen',
  },
  {
    window: '6–30 months',
    title: 'Build resilience',
    detail: 'Shut-in stock and tie-backs compete for capital.',
    actions: '97 kb/d screen',
  },
];

export default function RecoveryPortfolioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recovery portfolio"
        title="Actions, stage gates and accountability"
        description="A decision queue that separates attractive opportunity from assured delivery—ranking interventions by value, volume, confidence, timing and execution readiness."
        aside={
          <>
            <StatusPill tone="amber">Modeled opportunity set</StatusPill>
            <span className="filter-chip">6 interventions</span>
            <span className="filter-chip">Gross value basis</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Screened opportunity"
          value="200 kb/d"
          detail="Unrisked action register"
          trend="6 interventions"
          icon={Target}
        />
        <MetricCard
          eyebrow="Higher-confidence volume"
          value={`${gatedVolume} kb/d`}
          detail="Confidence at or above 65%"
          trend="4 interventions"
          icon={CheckCircle2}
          accent="teal"
        />
        <MetricCard
          eyebrow="Annual gross potential"
          value={`$${totalValue.toFixed(2)}bn`}
          detail="At modeled $75/bbl basis"
          trend="Before fiscal take"
          icon={BadgeDollarSign}
          accent="amber"
        />
        <MetricCard
          eyebrow="Near-term decision set"
          value="63 kb/d"
          detail="Two actions inside 90 days"
          trend="$1.55bn / yr"
          icon={Flag}
          accent="blue"
        />
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Executive recovery queue"
          subtitle="Ranked portfolio of modeled interventions; values are illustrative until evidence and economics pass the stated gates."
          meta={<StatusPill tone="blue">Priority order</StatusPill>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#e8ebe7] bg-[#fafbf9] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7d8985]">
                <th className="px-6 py-3">Rank / intervention</th>
                <th className="px-4 py-3 text-right">Volume</th>
                <th className="px-4 py-3 text-right">Gross value</th>
                <th className="px-4 py-3">Timing</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Spend</th>
                <th className="px-6 py-3">Decision gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {recoveryActions.map((item) => (
                <tr
                  key={item.rank}
                  className="text-xs text-[#566662] hover:bg-[#fafbf9]"
                >
                  <td
                    className="px-6 py-4"
                    aria-label={`Priority ${item.rank}: ${item.action}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eaf2ee] font-mono text-[11px] font-bold text-[#176a5e]">
                        {item.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-[#213d39]">
                          {item.action}
                        </p>
                        <p className="mt-1 text-[10px] text-[#8a9692]">
                          Risk: {item.risk}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-semibold text-[#176a5e]">
                    +{item.volume} kb/d
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-semibold text-[#8b671f]">
                    ${item.value.toFixed(2)}bn
                  </td>
                  <td className="px-4 py-4">{item.timing}</td>
                  <td
                    className="px-4 py-4"
                    aria-label={`${item.confidence}% delivery confidence`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#e8ebe7]">
                        <div
                          className={`h-full rounded-full ${item.confidence >= 70 ? 'bg-[#2b8877]' : item.confidence >= 55 ? 'bg-[#c49c4c]' : 'bg-[#b86651]'}`}
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px]">
                        {item.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{item.owner}</td>
                  <td className="px-4 py-4 font-mono text-[#667570]">
                    {item.spend}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill
                      tone={
                        item.rank <= 2
                          ? 'teal'
                          : item.rank <= 4
                            ? 'amber'
                            : 'gray'
                      }
                    >
                      {item.stage}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="panel">
          <PanelHeader
            title="Confidence–value portfolio map"
            subtitle="Bubble size represents screened production volume. Upper-right actions merit the strongest sponsor attention."
          />
          <div className="h-[360px] min-w-0 px-2 pb-5 pt-4 sm:px-4">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              initialDimension={{ width: 720, height: 360 }}
            >
              <ScatterChart
                margin={{ top: 14, right: 24, bottom: 18, left: 0 }}
              >
                <CartesianGrid stroke="#e9ece7" strokeDasharray="3 4" />
                <XAxis
                  type="number"
                  dataKey="confidence"
                  name="Confidence"
                  unit="%"
                  domain={[40, 90]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#778480', fontSize: 10 }}
                  label={{
                    value: 'Delivery confidence',
                    position: 'insideBottom',
                    offset: -10,
                    fill: '#778480',
                    fontSize: 10,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="value"
                  name="Gross value"
                  unit="bn"
                  domain={[0, 1.5]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#778480', fontSize: 10 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <ZAxis type="number" dataKey="volume" range={[90, 520]} />
                <ReferenceLine x={65} stroke="#c69b49" strokeDasharray="4 4" />
                <ReferenceLine y={0.6} stroke="#c69b49" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) =>
                    name === 'Gross value'
                      ? [`$${Number(value).toFixed(2)}bn`, name]
                      : [
                          `${Number(value)}${name === 'Confidence' ? '%' : ''}`,
                          String(name),
                        ]
                  }
                />
                <Scatter name="Actions" data={recoveryActions} fill="#17806d" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Delivery roadmap"
            subtitle="The work is sequenced to secure value early without bypassing assurance."
          />
          <div className="p-5 sm:p-6">
            <div className="relative space-y-6 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-[#dfe5df]">
              {milestones.map((milestone, index) => (
                <div key={milestone.window} className="relative flex gap-4">
                  <div
                    className={`z-10 grid size-9 shrink-0 place-items-center rounded-full border-4 border-white ${index === 0 ? 'bg-[#187a69] text-white' : 'bg-[#e8eeea] text-[#63726e]'}`}
                  >
                    <CircleDot className="size-4" />
                  </div>
                  <div className="flex-1 rounded-xl border border-[#e4e8e3] bg-[#fafbf9] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#27433f]">
                        {milestone.title}
                      </p>
                      <span className="font-mono text-[10px] text-[#9a7329]">
                        {milestone.window}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#788581]">
                      {milestone.detail}
                    </p>
                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#2a766a]">
                      {milestone.actions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="panel">
          <PanelHeader
            title="Stage-gate assurance"
            subtitle="Minimum evidence required to move from opportunity to a booked delivery commitment."
          />
          <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                gate: 'G0',
                title: 'Signal qualified',
                items: [
                  'Volume baseline reconciled',
                  'Cause hypothesis logged',
                ],
              },
              {
                gate: 'G1',
                title: 'Intervention defined',
                items: ['Scope and owner named', 'HSE / operability reviewed'],
              },
              {
                gate: 'G2',
                title: 'Economics assured',
                items: [
                  'Entitlement and fiscal check',
                  'Cost / schedule risked',
                ],
              },
              {
                gate: 'G3',
                title: 'Delivery committed',
                items: ['Resources mobilized', 'Benefits tracking active'],
              },
            ].map((gate, index) => (
              <div
                key={gate.gate}
                className={`p-5 sm:p-6 ${index < 3 ? 'border-b border-[#e8ebe7] sm:border-r xl:border-b-0' : ''}`}
              >
                <span className="font-mono text-[10px] font-bold text-[#a07628]">
                  {gate.gate}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-[#27423f]">
                  {gate.title}
                </h3>
                <div className="mt-4 space-y-2">
                  {gate.items.map((item) => (
                    <p
                      key={item}
                      className="flex items-start gap-2 text-[11px] leading-4 text-[#788581]"
                    >
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#4c8c80]" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="overflow-hidden rounded-[20px] bg-[#143b39] p-6 text-white">
          <UsersRound className="size-5 text-[#e0bb6b]" />
          <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em]">
            Accountability model
          </h2>
          <div className="mt-5 space-y-3 text-xs text-white/58">
            <p>
              <strong className="text-white/85">Sponsor:</strong> removes
              portfolio-level constraints.
            </p>
            <p>
              <strong className="text-white/85">Single owner:</strong> commits
              scope, date and evidence.
            </p>
            <p>
              <strong className="text-white/85">Finance:</strong> assures value
              basis and realization.
            </p>
            <p>
              <strong className="text-white/85">Independent assurance:</strong>{' '}
              validates benefits before recognition.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#ead8b4] bg-[#fffaf0] p-4 text-xs leading-5 text-[#776641]">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong className="text-[#54401c]">Causal guardrail:</strong> no
          action should be authorized solely from a public production decline.
          Intervention scope requires asset evidence, operator confirmation and
          normal technical assurance.
        </p>
      </div>
    </>
  );
}
