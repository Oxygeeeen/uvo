import {
  ArrowUpRight,
  BadgeCheck,
  DatabaseZap,
  GitBranch,
  Layers3,
  RadioTower,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

import {
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import { sources } from '@/lib/dashboard-data';

const definitions = [
  {
    term: 'Crude oil',
    meaning:
      'Liquid hydrocarbons reported as crude; used for the quota comparison.',
  },
  {
    term: 'Condensate',
    meaning:
      'Lease or field condensate shown separately from crude in NUPRC releases.',
  },
  {
    term: 'Combined liquids',
    meaning: 'Crude plus condensate for the Nigeria operating trend.',
  },
  {
    term: 'Petroleum & other liquids',
    meaning: 'The broader EIA measure used only for global comparison.',
  },
  {
    term: 'Gross value exposure',
    meaning:
      'Volume gap × price before fiscal take, entitlement, costs and differentials.',
  },
  {
    term: 'Recovery confidence',
    meaning:
      'Modeled delivery-likelihood score; not a statistical probability.',
  },
];

export default function SourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Source register"
        title="Lineage, freshness and definitions"
        description="A complete evidence register showing which figures are reported, reconciled, modeled or methodological—and how they flow into executive decisions."
        aside={
          <>
            <StatusPill tone="teal">6 external sources current</StatusPill>
            <span className="filter-chip">Last review: 06 Sep 2026</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Registered datasets"
          value="8"
          detail="External and modeled layers"
          trend="100% classified"
          icon={DatabaseZap}
        />
        <MetricCard
          eyebrow="Reported / reference"
          value="6"
          detail="NUPRC and EIA sources"
          trend="Public evidence"
          icon={RadioTower}
          accent="blue"
        />
        <MetricCard
          eyebrow="Modeled registers"
          value="2"
          detail="Planning case and actions"
          trend="Clearly labeled"
          icon={Layers3}
          accent="amber"
        />
        <MetricCard
          eyebrow="Lineage controls"
          value="Passed"
          detail="Source, period, unit, definition"
          trend="0 exceptions"
          icon={ShieldCheck}
          accent="teal"
        />
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Enterprise source register"
          subtitle="Direct links, coverage, cadence, freshness and evidence classification for every dashboard layer."
          meta={<StatusPill tone="blue">Controlled register</StatusPill>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-[#e8ebe7] bg-[#fafbf9] text-[10px] uppercase tracking-[0.08em] text-[#7d8985]">
                <th className="px-6 py-3">Source / dataset</th>
                <th className="px-4 py-3">Coverage</th>
                <th className="px-4 py-3">Cadence</th>
                <th className="px-4 py-3">As of</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0eb]">
              {sources.map((source) => (
                <tr
                  key={`${source.source}-${source.dataset}`}
                  className="text-xs text-[#5a6966] hover:bg-[#fafbf9]"
                >
                  <td className="px-6 py-4">
                    <a
                      href={source.href}
                      target={
                        source.href.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        source.href.startsWith('http')
                          ? 'noreferrer'
                          : undefined
                      }
                      className="group inline-flex items-start gap-2 font-semibold text-[#26423e] hover:text-[#0c6c5e]"
                    >
                      <span>
                        <span className="text-[10px] uppercase tracking-[0.08em] text-[#8b9693]">
                          {source.source}
                        </span>
                        <br />
                        {source.dataset}
                      </span>
                      <ArrowUpRight className="mt-3 size-3.5 shrink-0 opacity-35 transition group-hover:opacity-100" />
                    </a>
                  </td>
                  <td className="max-w-[340px] px-4 py-4 leading-5">
                    {source.coverage}
                  </td>
                  <td className="px-4 py-4">{source.cadence}</td>
                  <td className="px-4 py-4 font-mono text-[11px]">
                    {source.asOf}
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill
                      tone={
                        source.status === 'Current'
                          ? 'teal'
                          : source.status === 'Assumption'
                            ? 'amber'
                            : 'gray'
                      }
                    >
                      {source.status}
                    </StatusPill>
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill
                      tone={
                        source.type === 'Reported'
                          ? 'blue'
                          : source.type === 'Modeled'
                            ? 'amber'
                            : 'gray'
                      }
                    >
                      {source.type}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel mt-4">
        <PanelHeader
          title="Decision lineage"
          subtitle="Every executive measure follows the same controlled path from publication to action."
        />
        <div className="grid gap-0 md:grid-cols-5">
          {[
            {
              step: '01',
              icon: RadioTower,
              title: 'Acquire',
              body: 'Capture publication, period and original unit.',
            },
            {
              step: '02',
              icon: RefreshCw,
              title: 'Harmonize',
              body: 'Align monthly averages, definitions and units.',
            },
            {
              step: '03',
              icon: BadgeCheck,
              title: 'Reconcile',
              body: 'Tie totals, period movements and exceptions.',
            },
            {
              step: '04',
              icon: GitBranch,
              title: 'Model',
              body: 'Apply labeled plan, price and confidence inputs.',
            },
            {
              step: '05',
              icon: ShieldCheck,
              title: 'Decide',
              body: 'Present traceable exposure and stage-gated actions.',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`relative p-5 sm:p-6 ${index < 4 ? 'border-b border-[#e8ebe7] md:border-b-0 md:border-r' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#9a7125]">
                  {item.step}
                </span>
                <item.icon className="size-4 text-[#3e8075]" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[#28433f]">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-[#7b8784]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(350px,0.8fr)]">
        <section className="panel">
          <PanelHeader
            title="Metric dictionary"
            subtitle="The definitions executives should use when interpreting this dashboard."
          />
          <div className="grid gap-0 sm:grid-cols-2">
            {definitions.map((definition, index) => (
              <div
                key={definition.term}
                className={`p-5 sm:p-6 ${index % 2 === 0 ? 'sm:border-r' : ''} ${index < 4 ? 'border-b border-[#e8ebe7]' : ''}`}
              >
                <p className="text-xs font-semibold text-[#29443f]">
                  {definition.term}
                </p>
                <p className="mt-2 text-[11px] leading-5 text-[#7b8784]">
                  {definition.meaning}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Monthly close protocol"
            subtitle="Minimum checklist before the dashboard is marked current."
          />
          <div className="p-5 sm:p-6">
            <div className="space-y-4">
              {[
                'Archive the original publication and retrieval date',
                'Reconcile national crude, condensate and combined totals',
                'Validate terminal period movement and evidence labels',
                'Refresh price and global context on their own cadence',
                'Approve material assumption changes with rationale',
                'Issue executive commentary without causal overreach',
              ].map((item, index) => (
                <div key={item} className="flex gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e8f2ee] font-mono text-[9px] font-bold text-[#176a5e]">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-xs leading-5 text-[#687773]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
