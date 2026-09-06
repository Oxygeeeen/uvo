import {
  BadgeCheck,
  BookOpenCheck,
  Calculator,
  FileCheck2,
  RefreshCw,
  Scale,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';

import {
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import { modelInputs } from '@/lib/dashboard-data';

const qualityRules = [
  {
    level: 'Reported',
    rule: 'Directly reproduced or calculated from a named public publication.',
    treatment: 'Eligible for current-state reporting',
    tone: 'teal' as const,
  },
  {
    level: 'Reconciled',
    rule: 'Checked across periods, units and definitions with no material variance.',
    treatment: 'Eligible for trend reporting',
    tone: 'blue' as const,
  },
  {
    level: 'Modeled',
    rule: 'Planning input, allocation or opportunity created for scenario analysis.',
    treatment: 'Always labeled; never presented as reported',
    tone: 'amber' as const,
  },
  {
    level: 'Unverified',
    rule: 'Evidence incomplete, stale or definition not aligned.',
    treatment: 'Excluded from executive value totals',
    tone: 'rose' as const,
  },
];

export default function AssumptionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assumptions & governance"
        title="Model controls, methodology and assurance"
        description="The control room for every planning input, calculation convention, evidence label and approval needed to keep executive decisions auditable."
        aside={
          <>
            <StatusPill tone="teal">Version 2.1 controlled</StatusPill>
            <span className="filter-chip">Owner: Value Office</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Controlled inputs"
          value="6"
          detail="Owners and review cadence"
          trend="All assigned"
          icon={FileCheck2}
        />
        <MetricCard
          eyebrow="Scenario target"
          value="1.80 mb/d"
          detail="Executive planning case"
          trend="Not regulatory"
          icon={Scale}
          accent="amber"
        />
        <MetricCard
          eyebrow="Base price"
          value="$75 / bbl"
          detail="Sensitivity anchor"
          trend="Monthly review"
          icon={Calculator}
          accent="blue"
        />
        <MetricCard
          eyebrow="Assurance status"
          value="Current"
          detail="Last method review: 06 Sep"
          trend="0 overdue"
          icon={ShieldCheck}
          accent="teal"
        />
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Controlled model input register"
          subtitle="Each modeled variable has a named owner, review frequency and explicit classification."
          meta={<StatusPill tone="blue">Audit ready</StatusPill>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left">
            <thead>
              <tr className="border-b border-[#e8ebe7] bg-[#fafbf9] text-[10px] uppercase tracking-[0.08em] text-[#7d8985]">
                <th className="px-6 py-3">Input</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Accountable owner</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-6 py-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {modelInputs.map((input) => (
                <tr key={input.input} className="text-xs text-[#5a6966]">
                  <td className="px-6 py-4 font-semibold text-[#263f3c]">
                    {input.input}
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-[#176a5e]">
                    {input.value}
                  </td>
                  <td className="px-4 py-4">{input.owner}</td>
                  <td className="px-4 py-4">{input.review}</td>
                  <td className="px-6 py-4">
                    <StatusPill
                      tone={
                        input.classification === 'Scenario'
                          ? 'amber'
                          : input.classification === 'Method'
                            ? 'blue'
                            : 'gray'
                      }
                    >
                      {input.classification}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)]">
        <section className="panel">
          <PanelHeader
            title="Value methodology"
            subtitle="Transparent calculation from physical recovery to the gross screening value shown in the simulator."
          />
          <div className="p-5 sm:p-6">
            <div className="rounded-2xl border border-[#dfe5df] bg-[#f7faf8] p-5">
              <p className="font-mono text-sm font-semibold leading-7 text-[#1e554e]">
                Annual gross value = recovery kb/d × 1,000 × price $/bbl × 365 ×
                realization % × productive-days factor
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: 'Included',
                  items: [
                    'Recovered production volume',
                    'Scenario oil price',
                    'Realization factor',
                    'Disruption-day adjustment',
                  ],
                },
                {
                  title: 'Excluded until assured',
                  items: [
                    'Fiscal and entitlement share',
                    'Royalties and tax',
                    'Opex, logistics and capex',
                    'Grade differentials and financing',
                  ],
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-xl border border-[#e4e8e3] p-4"
                >
                  <p className="text-xs font-semibold text-[#29443f]">
                    {group.title}
                  </p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <p
                        key={item}
                        className="flex items-start gap-2 text-[11px] text-[#788581]"
                      >
                        <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-[#4c8c80]" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Governance RACI"
            subtitle="Required accountability for model changes and benefit recognition."
          />
          <div className="divide-y divide-[#edf0eb] px-5 sm:px-6">
            {[
              {
                role: 'Responsible',
                owner: 'Value analytics',
                work: 'Refresh data and calculations',
              },
              {
                role: 'Accountable',
                owner: 'Portfolio planning',
                work: 'Approve planning case',
              },
              {
                role: 'Consulted',
                owner: 'Operations + Finance',
                work: 'Validate scope and economics',
              },
              {
                role: 'Informed',
                owner: 'Executive committee',
                work: 'Receive decision brief',
              },
            ].map((row) => (
              <div
                key={row.role}
                className="grid gap-2 py-4 sm:grid-cols-[95px_130px_1fr] sm:items-center"
              >
                <StatusPill
                  tone={row.role === 'Accountable' ? 'amber' : 'gray'}
                >
                  {row.role}
                </StatusPill>
                <p className="text-xs font-semibold text-[#314a46]">
                  {row.owner}
                </p>
                <p className="text-xs text-[#7b8784]">{row.work}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Evidence quality standard"
          subtitle="Rules determine what can enter current-state reporting, trend analysis and decision value."
        />
        <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
          {qualityRules.map((item, index) => (
            <div
              key={item.level}
              className={`p-5 sm:p-6 ${index < 3 ? 'border-b border-[#e8ebe7] sm:border-r xl:border-b-0' : ''}`}
            >
              <StatusPill tone={item.tone}>{item.level}</StatusPill>
              <p className="mt-4 text-xs leading-5 text-[#5f6f6b]">
                {item.rule}
              </p>
              <p className="mt-4 border-t border-[#e9ece7] pt-3 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#7c8985]">
                {item.treatment}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="panel p-5 sm:p-6">
          <BookOpenCheck className="size-5 text-[#29786b]" />
          <h2 className="mt-4 panel-title">Definition control</h2>
          <p className="mt-2 text-xs leading-5 text-[#778480]">
            Crude, condensate and petroleum-and-other-liquids are retained as
            separate measures with source and period attached.
          </p>
        </section>
        <section className="panel p-5 sm:p-6">
          <RefreshCw className="size-5 text-[#4b758c]" />
          <h2 className="mt-4 panel-title">Change protocol</h2>
          <p className="mt-2 text-xs leading-5 text-[#778480]">
            Any material target, price or methodology change requires owner
            approval, dated rationale and restatement of affected scenarios.
          </p>
        </section>
        <section className="rounded-[20px] bg-[#123b39] p-6 text-white">
          <TriangleAlert className="size-5 text-[#e0bb6b]" />
          <h2 className="mt-4 text-[15px] font-semibold">
            Causality remains out of scope.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/55">
            This public-data model locates variance and screens value. It does
            not determine theft, maintenance, reservoir performance or root
            cause.
          </p>
        </section>
      </div>
    </>
  );
}
