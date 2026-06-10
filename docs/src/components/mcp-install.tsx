import type { ReactNode } from 'react';

export function McpInstall({ editor, children }: { editor: string; children?: ReactNode }) {
  return (
    <>
      <p>
        The Open Knowledge desktop app handles this for you. The first time you open a project, a
        consent dialog detects {editor} and configures it.
      </p>
      {children}
      <p>
        To re-trigger the dialog, delete <code>~/.ok/mcp-status.json</code> and relaunch.
      </p>
    </>
  );
}
