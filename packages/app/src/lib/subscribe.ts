const SUBSCRIBE_ENDPOINT = 'https://openknowledge.ai/api/subscribe';

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'unavailable' | 'error' };

export async function submitSubscribe(email: string): Promise<SubscribeResult> {
  try {
    const response = await fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(15_000),
    });
    if (response.ok) {
      return { ok: true };
    }
    if (response.status === 400) {
      return { ok: false, reason: 'invalid' };
    }
    if (response.status === 503) {
      return { ok: false, reason: 'unavailable' };
    }
    console.warn(`[subscribe] action=submit result=http-error status=${response.status}`);
    return { ok: false, reason: 'error' };
  } catch (err) {
    console.warn(
      `[subscribe] action=submit result=network-error message=${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    return { ok: false, reason: 'error' };
  }
}
