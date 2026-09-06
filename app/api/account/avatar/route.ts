import {
  BlobAccessError,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
  put,
} from '@vercel/blob';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { assertDatabaseConfigured, db } from '@/lib/db';
import { isSameOriginMutation } from '@/lib/request-security';

export const runtime = 'nodejs';

const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxBytes = 2 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) {
    return NextResponse.json(
      { error: 'Invalid request origin.' },
      { status: 403 },
    );
  }
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Avatar storage is not configured.' },
      { status: 503 },
    );
  }

  const data = await request.formData();
  const file = data.get('avatar');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Choose a profile image.' },
      { status: 400 },
    );
  }
  if (!acceptedTypes.has(file.type)) {
    return NextResponse.json(
      { error: 'Use a PNG, JPEG or WebP image.' },
      { status: 400 },
    );
  }
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: 'Profile images must be 2 MB or smaller.' },
      { status: 400 },
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80);
  let blob: { url: string };
  try {
    blob = await put(`avatars/${session.user.id}/${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    if (error instanceof BlobStoreNotFoundError) {
      return NextResponse.json(
        {
          error:
            'Profile photo storage is not connected. Create or connect a Vercel Blob store, then refresh BLOB_READ_WRITE_TOKEN.',
        },
        { status: 503 },
      );
    }
    if (error instanceof BlobAccessError) {
      return NextResponse.json(
        { error: 'The profile photo storage token is invalid or expired.' },
        { status: 503 },
      );
    }
    if (error instanceof BlobStoreSuspendedError) {
      return NextResponse.json(
        { error: 'Profile photo storage is currently suspended.' },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: 'Profile photo storage is temporarily unavailable.' },
      { status: 502 },
    );
  }

  assertDatabaseConfigured();
  await db.query(
    'UPDATE "user" SET image = $1, "updatedAt" = NOW() WHERE id = $2',
    [blob.url, session.user.id],
  );

  return NextResponse.json({ image: blob.url });
}
