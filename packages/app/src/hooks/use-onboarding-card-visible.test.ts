import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import type { OkDesktopBridge } from '@/lib/desktop-bridge-types';
import { evaluateFreshProject } from './use-onboarding-card-visible';

const CURRENT_PATH = '/Users/me/project';

function bridgeWith(recents: Array<{ path: string }>): OkDesktopBridge {
  return {
    project: { listRecent: () => Promise.resolve(recents) },
    config: { projectPath: CURRENT_PATH },
  } as unknown as OkDesktopBridge;
}

function rejectingBridge(): OkDesktopBridge {
  return {
    project: { listRecent: () => Promise.reject(new Error('IPC down')) },
    config: { projectPath: CURRENT_PATH },
  } as unknown as OkDesktopBridge;
}

function mockDocumentsResponse(body: unknown, status = 200): void {
  globalThis.fetch = mock(() =>
    Promise.resolve(new Response(JSON.stringify(body), { status })),
  ) as never;
}

const aDocument = { kind: 'document', docName: 'welcome', size: 0, modified: '2026-06-30' };

let originalFetch: typeof globalThis.fetch;
beforeEach(() => {
  originalFetch = globalThis.fetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe('evaluateFreshProject', () => {
  test('fresh single project with zero entries → true', async () => {
    mockDocumentsResponse({ documents: [] });
    expect(await evaluateFreshProject(bridgeWith([{ path: CURRENT_PATH }]))).toBe(true);
  });

  test('an empty recents list still counts as no-other-project → true when empty', async () => {
    mockDocumentsResponse({ documents: [] });
    expect(await evaluateFreshProject(bridgeWith([]))).toBe(true);
  });

  test('a second switchable project → false (does not fetch documents)', async () => {
    const fetchSpy = mock(() => Promise.resolve(new Response('{}', { status: 200 })));
    globalThis.fetch = fetchSpy as never;
    expect(
      await evaluateFreshProject(bridgeWith([{ path: CURRENT_PATH }, { path: '/other/project' }])),
    ).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test('project already has content → false', async () => {
    mockDocumentsResponse({ documents: [aDocument] });
    expect(await evaluateFreshProject(bridgeWith([{ path: CURRENT_PATH }]))).toBe(false);
  });

  test('listRecent rejection is suppressed → false (fail-safe)', async () => {
    mockDocumentsResponse({ documents: [] });
    expect(await evaluateFreshProject(rejectingBridge())).toBe(false);
  });

  test('non-ok /api/documents response → false (fail-safe)', async () => {
    mockDocumentsResponse({ error: 'boom' }, 500);
    expect(await evaluateFreshProject(bridgeWith([{ path: CURRENT_PATH }]))).toBe(false);
  });

  test('schema-violating /api/documents body → false (fail-safe)', async () => {
    mockDocumentsResponse({ unexpected: 'shape' });
    expect(await evaluateFreshProject(bridgeWith([{ path: CURRENT_PATH }]))).toBe(false);
  });
});
