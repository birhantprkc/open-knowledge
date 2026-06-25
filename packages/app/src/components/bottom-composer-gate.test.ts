import { describe, expect, test } from 'bun:test';
import { type BottomComposerGateInputs, shouldShowBottomComposer } from './bottom-composer-gate';

const PASSING: BottomComposerGateInputs = {
  terminalVisible: false,
  isEmbedded: false,
  isDesktop: true,
  activeDocName: 'notes',
};

describe('shouldShowBottomComposer', () => {
  test('renders when desktop, not embedded, terminal closed, and a doc is open', () => {
    expect(shouldShowBottomComposer(PASSING)).toBe(true);
  });

  describe('each gate input independently hides the composer', () => {
    test('hidden when the terminal is open', () => {
      expect(shouldShowBottomComposer({ ...PASSING, terminalVisible: true })).toBe(false);
    });

    test('hidden when the host is embedded', () => {
      expect(shouldShowBottomComposer({ ...PASSING, isEmbedded: true })).toBe(false);
    });

    test('hidden when not the desktop app (no window.okDesktop)', () => {
      expect(shouldShowBottomComposer({ ...PASSING, isDesktop: false })).toBe(false);
    });

    test('hidden when no document is open', () => {
      expect(shouldShowBottomComposer({ ...PASSING, activeDocName: null })).toBe(false);
    });
  });

  test('stays hidden when several inputs fail at once', () => {
    expect(
      shouldShowBottomComposer({
        terminalVisible: true,
        isEmbedded: true,
        isDesktop: false,
        activeDocName: null,
      }),
    ).toBe(false);
  });
});
