'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Download,
  FileText,
  ShieldAlert,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const positions = [
  ['Production', '1.670 mb/d', '130 kb/d below plan'],
  ['Gross value exposure', '$293m / month', 'At $75/bbl planning price'],
  ['Priority recovery', '+63 kb/d', '$1.72bn annual gross value'],
];

export function ExecutiveBriefDialog() {
  const [copied, setCopied] = useState(false);

  async function copyBrief() {
    await navigator.clipboard.writeText(
      'Nigeria Oil Value Executive Brief — July 2026\nCurrent production is 1.670 mb/d, 130 kb/d (7.2%) below plan, implying approximately $293m monthly gross value exposure at $75/bbl. The base outlook improves to 1.79 mb/d by October, while the downside scenario reaches 1.60 mb/d. Prioritize the first 63 kb/d of recovery across evacuation reliability, planned maintenance compression and short-cycle well interventions. Executive decisions: confirm accountable sponsors, release stage-gated funding, and require causal and economic assurance before attributing public production declines.',
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="hidden rounded-xl bg-white md:flex"
          />
        }
      >
        <Download /> Export brief
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-[22px] p-0 sm:max-w-[760px]">
        <div className="rounded-t-[22px] bg-[#073b3a] px-6 py-6 text-white sm:px-8">
          <DialogHeader>
            <div className="mb-3 flex items-center justify-between pr-7">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d5e7e2]">
                Executive decision brief · July 2026 close
              </span>
              <FileText className="size-5 text-[#e4bd6e]" />
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-[-0.03em] text-white">
              Protect today&apos;s value. Sequence the recoverable barrel.
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-6 text-[#bad3cd]">
              A concise, decision-ready synthesis of performance, exposure,
              outlook and priority action—not a page printout.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {positions.map(([label, value, note]) => (
              <div
                key={label}
                className="rounded-2xl border border-[#e2e6e0] bg-[#fafbf8] p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c8884]">
                  {label}
                </p>
                <p className="mt-2 font-mono text-lg font-semibold text-[#17302e]">
                  {value}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-[#7b8784]">
                  {note}
                </p>
              </div>
            ))}
          </div>

          <section className="grid gap-5 sm:grid-cols-[1fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0b675a]">
                <Target className="size-4" />
                Executive readout
              </p>
              <p className="mt-3 text-sm leading-6 text-[#53615e]">
                Production is{' '}
                <strong className="text-[#17302e]">
                  7.2% below the 1.80 mb/d plan
                </strong>
                . Base recovery supports 1.79 mb/d by October, but a sustained
                evacuation or uptime event creates a 1.60 mb/d downside. At the
                planning price, every 10 kb/d restored screens at about $274m
                annual gross value.
              </p>
            </div>
            <div className="rounded-2xl border border-[#ead8ae] bg-[#fff9ec] p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#8a6928]">
                <ShieldAlert className="size-4" />
                Decision guardrail
              </p>
              <p className="mt-3 text-xs leading-5 text-[#6f5a2c]">
                Public production variance does not establish whether theft,
                maintenance, evacuation, measurement, or reservoir performance
                caused a decline. Confirm causal evidence and net economics
                before sanctioning action.
              </p>
            </div>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b675a]">
              Decisions requested
            </p>
            <div className="mt-3 divide-y divide-[#e5e8e3] rounded-2xl border border-[#e1e5df]">
              {[
                [
                  'Confirm accountable sponsors',
                  'Assign single-point leadership for evacuation reliability, maintenance compression and well restoration.',
                ],
                [
                  'Release stage-gated recovery funding',
                  'Prioritize the first 63 kb/d using probability-weighted, net-value ranking and defined stop/go gates.',
                ],
                [
                  'Mandate weekly assurance',
                  'Track recovered barrels, sustained uptime, source freshness and variance-to-commitment in the executive cadence.',
                ],
              ].map(([title, detail], index) => (
                <div key={title} className="flex gap-3 p-4">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e7f3ee] text-[11px] font-bold text-[#0b675a]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#203735]">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#74807d]">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-b-[22px] px-6 sm:px-8">
          <Button variant="outline" onClick={copyBrief} className="rounded-xl">
            {copied ? <Check /> : <FileText />}
            {copied ? 'Copied' : 'Copy summary'}
          </Button>
          <Button
            onClick={() => window.location.assign('/api/executive-brief')}
            className="rounded-xl bg-[#0b5d54] text-white hover:bg-[#084c45]"
          >
            <Download />
            Download executive PDF
            <ArrowUpRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
