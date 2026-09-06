'use client';

import {
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
  Award,
  BarChart3,
  Compass,
  Database,
  Globe2,
  Landmark,
} from 'lucide-react';

import {
  MetricCard,
  PageHeader,
  PanelHeader,
  StatusPill,
} from '@/components/dashboard-ui';
import { globalProduction } from '@/lib/dashboard-data';

const africaPeers = globalProduction.filter(
  (country) => country.region === 'Africa',
);

export default function GlobalBenchmarkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Global benchmark"
        title="Nigeria in the global liquids landscape"
        description="A dedicated external-context screen comparing production scale with selected global producers and African peers using one consistent EIA definition."
        aside={
          <>
            <StatusPill tone="blue">EIA 2025 dataset</StatusPill>
            <span className="filter-chip">Petroleum & other liquids</span>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          eyebrow="Global position"
          value="#15"
          detail="Selected EIA production rank"
          trend="2025 average"
          icon={Globe2}
          accent="blue"
        />
        <MetricCard
          eyebrow="African position"
          value="#1"
          detail="Among selected African peers"
          trend="1.675 mb/d"
          icon={Award}
        />
        <MetricCard
          eyebrow="Scale vs United States"
          value="7.1%"
          detail="Nigeria / US liquids output"
          trend="Relative scale"
          icon={BarChart3}
          accent="amber"
        />
        <MetricCard
          eyebrow="Proved crude reserves"
          value="37.5bn bbl"
          detail="EIA Nigeria analysis, 2024"
          trend="Context metric"
          icon={Landmark}
          accent="teal"
        />
      </div>

      <section className="panel mt-4">
        <PanelHeader
          title="Selected global production comparison"
          subtitle="2025 petroleum and other liquids production. Nigeria is highlighted; the list is curated for decision context."
          meta={<StatusPill tone="gray">mb/d</StatusPill>}
        />
        <div className="h-[580px] min-w-0 px-2 py-5 sm:px-5">
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            initialDimension={{ width: 1200, height: 580 }}
          >
            <BarChart
              data={globalProduction}
              layout="vertical"
              margin={{ top: 0, right: 34, bottom: 0, left: 10 }}
            >
              <CartesianGrid horizontal={false} stroke="#e9ece7" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#778480', fontSize: 10 }}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                type="category"
                dataKey="country"
                axisLine={false}
                tickLine={false}
                width={128}
                tick={{ fill: '#53635f', fontSize: 11 }}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(3)} mb/d`,
                  'Production',
                ]}
              />
              <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={18}>
                {globalProduction.map((country) => (
                  // oxlint-disable-next-line typescript/no-deprecated -- Recharts Cell is the supported per-datum color API.
                  <Cell
                    key={country.country}
                    fill={
                      country.country === 'Nigeria'
                        ? '#c0933e'
                        : country.region === 'Africa'
                          ? '#83a69e'
                          : '#356e68'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(350px,0.85fr)]">
        <section className="panel">
          <PanelHeader
            title="African peer lens"
            subtitle="Scale and headroom relative to Nigeria's reported 2025 EIA liquids average."
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-[#e8ebe7] bg-[#fafbf9] text-[10px] uppercase tracking-[0.08em] text-[#7d8985]">
                  <th className="px-6 py-3">Peer</th>
                  <th className="px-4 py-3 text-right">Global rank</th>
                  <th className="px-4 py-3 text-right">Production</th>
                  <th className="px-4 py-3 text-right">vs Nigeria</th>
                  <th className="px-6 py-3">Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0eb]">
                {africaPeers.map((peer) => (
                  <tr key={peer.country} className="text-xs text-[#5b6a67]">
                    <td
                      className="px-6 py-4"
                      aria-label={`${((peer.value / 1.675) * 100).toFixed(0)}% of Nigeria production`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${peer.country === 'Nigeria' ? 'bg-[#c0933e]' : 'bg-[#72998f]'}`}
                        />
                        <span className="font-semibold text-[#263f3c]">
                          {peer.country}
                        </span>
                        {peer.country === 'Nigeria' ? (
                          <StatusPill tone="amber">Nigeria</StatusPill>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-mono">
                      #{peer.rank}
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-semibold">
                      {peer.value.toFixed(3)} mb/d
                    </td>
                    <td
                      className={`px-4 py-4 text-right font-mono font-semibold ${peer.country === 'Nigeria' ? 'text-[#8c6b27]' : 'text-[#55716b]'}`}
                    >
                      {((peer.value / 1.675) * 100).toFixed(0)}%
                    </td>
                    <td
                      className="px-6 py-4"
                      aria-label={`${((peer.value / 1.675) * 100).toFixed(0)}% production index`}
                    >
                      <div className="h-1.5 w-full min-w-24 overflow-hidden rounded-full bg-[#e8ebe7]">
                        <div
                          className="h-full rounded-full bg-[#4d8b80]"
                          style={{
                            width: `${Math.min((peer.value / 1.675) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <PanelHeader
            title="Executive interpretation"
            subtitle="What the external comparison should—and should not—drive."
          />
          <div className="space-y-4 p-5 sm:p-6">
            {[
              {
                icon: Compass,
                title: 'Regional scale advantage',
                body: 'Nigeria leads the selected African peer set, reinforcing the strategic value of reliability and recovery.',
              },
              {
                icon: Database,
                title: 'Definitions govern the comparison',
                body: 'EIA petroleum and other liquids is broader than crude-only OPEC quotas and should not be mixed in one ranking.',
              },
              {
                icon: Landmark,
                title: 'Endowment is not delivered value',
                body: 'Reserve scale provides context; realized production still depends on investment, uptime, evacuation and field performance.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-3 rounded-xl border border-[#e5e9e3] bg-[#fafbf9] p-4"
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f1ed] text-[#1b7164]">
                  <item.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#28433f]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#7b8784]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-4 rounded-[18px] border border-[#dbe5e2] bg-[#f4f8f6] p-4 text-xs leading-5 text-[#5f746f]">
        <strong className="text-[#2a4a45]">Comparability note:</strong> all
        country bars use EIA petroleum and other liquids for 2025. The Nigeria
        operating screens use NUPRC crude plus condensate for July 2026;
        differences reflect period and definition, not a reconciliation error.
      </div>
    </>
  );
}
