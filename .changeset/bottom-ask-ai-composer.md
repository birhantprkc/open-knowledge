---
"@inkeep/open-knowledge": patch
---

Add a persistent "Ask AI" prompt composer to the bottom of the OK Desktop editor. When a document is open, a small "Ask AI" pill sits above the editor footer; press Cmd+L (Ctrl+L on Windows/Linux) or click it to expand a freetext composer, type an instruction about the current doc, and send it to your coding agent (Claude, Codex, or Cursor) without leaving the editor. It reuses the same handoff path as "Open with AI" and "Edit with AI", scoping the prompt to the current document. The agent picker lists your installed agents and remembers your last choice per machine, and the empty composer shows rotating example prompts (a single static suggestion when reduced motion is requested). The composer stays out of the way when it does not apply: it is hidden while the terminal is open, in embedded or web hosts, and when no document is open.

You can also pull a highlighted passage into the prompt as context: select text in the document and a removable snapshot pill appears in the composer. A short single-line selection is inlined verbatim; anything longer is sent as a reference the agent reads back from the file (line numbers in source mode, a passage anchor in rich-text mode), so the prompt stays compact. The pill persists when you move the cursor or click into the composer, is replaced when you highlight something new, and clears with its × or after you send.

The project-wide "Create Something Great" composer on the empty-state screen now supports the same `@`-mentions: type `@` to reference existing docs and files as chips, so a create brief can point the agent at the parts of the project to build on. The referenced paths are passed through to the agent alongside your brief.
