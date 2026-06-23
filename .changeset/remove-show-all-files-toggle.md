---
"@inkeep/open-knowledge": patch
---

Remove the "Show all files" sidebar toggle; the file tree now always lists everything on disk except dotfiles.

The sidebar previously had two visibility toggles — "Show hidden files" (dot-prefixed entries) and "Show all files" (files excluded by `.gitignore` / `.okignore`). "Show all files" is gone from every surface: the folder right-click menu, the sidebar empty-space menu, and the desktop View menu. The tree now always shows every file on disk — the previous "Show all files: on" default — so there is no way to scope it back to indexed/linked content. "Show hidden files" remains the single visibility toggle: off by default, revealing dot-prefixed entries when on. VCS and tooling internals (`.git`, `.ok`, `node_modules`) stay hidden in every mode, as before.
