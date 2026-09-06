import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { assertDatabaseConfigured, db } from '@/lib/db';
import { isSameOriginMutation } from '@/lib/request-security';

export const runtime = 'nodejs';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ user: session.user });
}

export async function PATCH(request: Request) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403 },
    );
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const profile = {
    name: String(body.name ?? '')
      .trim()
      .slice(0, 100),
    jobTitle: String(body.jobTitle ?? '')
      .trim()
      .slice(0, 120),
    businessUnit: String(body.businessUnit ?? '')
      .trim()
      .slice(0, 120),
    location: String(body.location ?? '')
      .trim()
      .slice(0, 120),
    timezone: String(body.timezone ?? 'Africa/Lagos')
      .trim()
      .slice(0, 80),
    weeklyBrief: Boolean(body.weeklyBrief),
    securityAlerts: Boolean(body.securityAlerts),
    disruptionAlerts: Boolean(body.disruptionAlerts),
  };

  if (profile.name.length < 2) {
    return NextResponse.json(
      { error: 'Enter a valid full name.' },
      { status: 400 },
    );
  }

  assertDatabaseConfigured();
  const result = await db.query(
    `UPDATE "user"
     SET name = $1, "jobTitle" = $2, "businessUnit" = $3, location = $4,
         timezone = $5, "weeklyBrief" = $6, "securityAlerts" = $7,
         "disruptionAlerts" = $8, "updatedAt" = NOW()
     WHERE id = $9
     RETURNING id, name, email, image, "emailVerified", "jobTitle", "businessUnit",
               location, timezone, "weeklyBrief", "securityAlerts", "disruptionAlerts", role`,
    [
      profile.name,
      profile.jobTitle,
      profile.businessUnit,
      profile.location,
      profile.timezone,
      profile.weeklyBrief,
      profile.securityAlerts,
      profile.disruptionAlerts,
      session.user.id,
    ],
  );

  return NextResponse.json({ user: result.rows[0] });
}
