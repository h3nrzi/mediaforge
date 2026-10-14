---
status: accepted
---

# Stable actors authenticate separately from current workspace authority

Approved by the Product Owner on 2026-10-14 in Module 01 discovery Q1–Q2: use individually issued opaque bearer credentials bound to immutable actor IDs, storing verifiers rather than recoverable secrets and requiring encrypted transport outside local development. Membership, combinable responsibilities and editable labels are separate from identity; resolve authority server-side, and retain stable actor IDs plus bounded action-time labels without rewriting historical attribution or restoring access through label matching. This trades the convenience of credential-carried roles/current-label-only attribution for reliable revocation and stable provenance; no authorization policy of a later capability is selected here.

Q7/Q9 were explicitly approved on the same date: credentials expire after 30 elapsed days without read/recovery extension or automatic renewal; membership removal invalidates credentials while preserving identity and admitted work. Exact-ID readmission requires fresh credentials and explicitly assigned responsibilities, with no automatic restoration; an admitted member may have zero responsibilities and still holds baseline shared read authority.

Requirements: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting Module 02 provenance contracts MF-HISTORY-01/02. [Approval and original alternatives](../../.scratch/mf-mod-01/technical-discovery.md).
