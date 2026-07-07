---
'@inkeep/open-knowledge': patch
---

Fix search snippets splitting an emoji across the truncation boundary, which left a lone UTF-16 surrogate in the JSON-RPC response and caused strict MCP clients (Rust / pydantic parsers) to reject it as invalid UTF-8. Snippets are now well-formed before serialization.
