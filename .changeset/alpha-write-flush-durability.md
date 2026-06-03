---
"@inkeep/open-knowledge-server": patch
"@inkeep/open-knowledge": patch
---

fix(open-knowledge): edit_document / edit_frontmatter / rollback surface disk-persistence failures (PRD-6832)

PRD-6838 made `write_document` await its disk flush and return a storage error
instead of a false "success" when the write fails to reach disk. The other
debounced-store MCP write handlers still returned success the instant the CRDT
transaction committed — so a crash inside the persistence debounce window, or a
swallowed disk failure (ENOSPC / EACCES / read-only FS), silently lost the write
while the agent was told it succeeded.

`edit_document` (agent-patch), `edit_frontmatter` (frontmatter-patch), and
`version` rollback now reuse the same awaited-flush + failure-surfacing pattern:
the handler force-flushes the L1 disk store and, on failure, responds with the
matching storage problem type (507 `storage-full` / 500 `storage-readonly` /
500 `storage-error`) rather than a success. The CRDT copy is still retained in
memory.

`create`, `delete`, `ingest`, and `rename` are unaffected: they write
synchronously (no debounced-store window) and were already durable.
