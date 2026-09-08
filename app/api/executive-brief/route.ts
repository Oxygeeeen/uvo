import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { auth } from '@/lib/auth';

export const runtime = 'nodejs';

function wrapText(text: string, maxCharacters: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoResponse = await fetch(new URL('/uvo-logo.png', request.url));
  if (!logoResponse.ok) {
    return NextResponse.json(
      { error: 'Executive brief logo asset is unavailable.' },
      { status: 503 },
    );
  }
  const logo = await pdf.embedPng(await logoResponse.arrayBuffer());
  const navy = rgb(0.027, 0.231, 0.227);
  const teal = rgb(0.043, 0.365, 0.329);
  const ink = rgb(0.09, 0.19, 0.18);
  const gray = rgb(0.38, 0.45, 0.43);
  const pale = rgb(0.965, 0.969, 0.949);

  page.drawRectangle({
    x: 0,
    y: 680,
    width: 595.28,
    height: 161.89,
    color: navy,
  });
  page.drawRectangle({
    x: 42,
    y: 764,
    width: 72,
    height: 38,
    color: rgb(1, 1, 1),
  });
  page.drawImage(logo, { x: 48, y: 769, width: 60, height: 28.7 });
  page.drawText('UPSTREAM VALUE OFFICE', {
    x: 128,
    y: 786,
    size: 10,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText('Nigerian Portfolio · Executive decision brief', {
    x: 128,
    y: 772,
    size: 8.5,
    font: regular,
    color: rgb(0.7, 0.83, 0.8),
  });
  page.drawText("Protect today's value.", {
    x: 42,
    y: 724,
    size: 25,
    font: bold,
    color: rgb(1, 1, 1),
  });
  page.drawText('Sequence the recoverable barrel.', {
    x: 42,
    y: 694,
    size: 25,
    font: bold,
    color: rgb(1, 1, 1),
  });

  const cards = [
    ['PRODUCTION', '1.670 mb/d', '130 kb/d below plan'],
    ['VALUE EXPOSURE', '$293m / month', 'At $75/bbl'],
    ['PRIORITY RECOVERY', '+63 kb/d', '$1.72bn annual gross'],
  ];
  cards.forEach((card, index) => {
    const x = 42 + index * 171;
    page.drawRectangle({
      x,
      y: 588,
      width: 157,
      height: 72,
      color: pale,
      borderColor: rgb(0.88, 0.9, 0.87),
      borderWidth: 0.7,
    });
    page.drawText(card[0], {
      x: x + 12,
      y: 641,
      size: 7,
      font: bold,
      color: gray,
    });
    page.drawText(card[1], {
      x: x + 12,
      y: 616,
      size: 16,
      font: bold,
      color: ink,
    });
    page.drawText(card[2], {
      x: x + 12,
      y: 599,
      size: 8,
      font: regular,
      color: gray,
    });
  });

  page.drawText('EXECUTIVE READOUT', {
    x: 42,
    y: 553,
    size: 8,
    font: bold,
    color: teal,
  });
  const readout =
    'Production is 7.2% below the 1.80 mb/d plan. The base outlook improves to 1.79 mb/d by October, while a sustained evacuation or uptime event creates a 1.60 mb/d downside. Every 10 kb/d restored screens at approximately $274m annual gross value at the planning price.';
  wrapText(readout, 94).forEach((line, index) =>
    page.drawText(line, {
      x: 42,
      y: 532 - index * 14,
      size: 9.4,
      font: regular,
      color: gray,
    }),
  );

  page.drawText('DECISIONS REQUESTED', {
    x: 42,
    y: 463,
    size: 8,
    font: bold,
    color: teal,
  });
  const decisions = [
    [
      '1',
      'Confirm accountable sponsors',
      'Assign single-point leadership for evacuation reliability, maintenance compression and well restoration.',
    ],
    [
      '2',
      'Release stage-gated recovery funding',
      'Prioritize the first 63 kb/d using probability-weighted, net-value ranking and explicit stop/go gates.',
    ],
    [
      '3',
      'Mandate weekly assurance',
      'Track recovered barrels, sustained uptime, source freshness and variance-to-commitment in the executive cadence.',
    ],
  ];
  decisions.forEach((decision, index) => {
    const y = 424 - index * 66;
    page.drawCircle({ x: 53, y: y + 4, size: 11, color: rgb(0.9, 0.95, 0.93) });
    page.drawText(decision[0], {
      x: 50.5,
      y: y,
      size: 8,
      font: bold,
      color: teal,
    });
    page.drawText(decision[1], {
      x: 76,
      y: y + 8,
      size: 10,
      font: bold,
      color: ink,
    });
    wrapText(decision[2], 82).forEach((line, lineIndex) =>
      page.drawText(line, {
        x: 76,
        y: y - 8 - lineIndex * 12,
        size: 8.3,
        font: regular,
        color: gray,
      }),
    );
  });

  page.drawRectangle({
    x: 42,
    y: 158,
    width: 511,
    height: 82,
    color: rgb(1, 0.976, 0.91),
    borderColor: rgb(0.92, 0.83, 0.65),
    borderWidth: 0.7,
  });
  page.drawText('DECISION GUARDRAIL', {
    x: 56,
    y: 220,
    size: 8,
    font: bold,
    color: rgb(0.53, 0.4, 0.15),
  });
  const guardrail =
    'Public production variance does not establish whether theft, maintenance, evacuation, measurement or reservoir performance caused a decline. Confirm causal evidence and net economics before sanctioning action.';
  wrapText(guardrail, 91).forEach((line, index) =>
    page.drawText(line, {
      x: 56,
      y: 201 - index * 13,
      size: 8.5,
      font: regular,
      color: rgb(0.41, 0.33, 0.17),
    }),
  );

  page.drawLine({
    start: { x: 42, y: 126 },
    end: { x: 553, y: 126 },
    thickness: 0.6,
    color: rgb(0.87, 0.89, 0.86),
  });
  page.drawText('Prepared from the July 2026 close · Planning case: $75/bbl', {
    x: 42,
    y: 105,
    size: 8,
    font: regular,
    color: gray,
  });
  page.drawText('Nigeria Oil Value Command Center', {
    x: 42,
    y: 86,
    size: 8,
    font: bold,
    color: ink,
  });
  page.drawText('Confidential · Executive decision support', {
    x: 374,
    y: 86,
    size: 8,
    font: regular,
    color: gray,
  });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        'attachment; filename="nigeria-oil-value-executive-brief.pdf"',
      'Cache-Control': 'private, no-store',
    },
  });
}
