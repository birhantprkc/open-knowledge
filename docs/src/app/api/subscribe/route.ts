import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID;

const subscribeSchema = z.object({
  email: z.email(),
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
} as const;

function json(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!RESEND_API_KEY || !RESEND_SEGMENT_ID) {
    console.error('[subscribe] RESEND_API_KEY or RESEND_SEGMENT_ID is not configured');
    return json({ error: 'Subscriptions are not available right now.' }, 503);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  const resend = new Resend(RESEND_API_KEY);
  const { error } = await resend.contacts.create({
    email: parsed.data.email,
    unsubscribed: false,
    segments: [{ id: RESEND_SEGMENT_ID }],
  });

  if (error) {
    console.error(`[subscribe] Resend create-contact failed: ${error.name} - ${error.message}`);
    return json({ error: 'Something went wrong. Please try again.' }, 502);
  }

  return json({ ok: true }, 200);
}
