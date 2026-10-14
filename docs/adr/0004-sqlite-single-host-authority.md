---
status: accepted
---

# SQLite on one host provides durable authority persistence

Approved by the Product Owner on 2026-10-14 in Module 01 discovery Q10: use SQLite on persistent local disk with WAL, synchronous=FULL and foreign-key enforcement, and acknowledge successful authority/bootstrap mutations only after durable commit. The initial authority deployment is one host with no live database on a network filesystem or independent multi-host authority writers; later admitted effects must participate in the approved atomic authority boundary rather than use an earlier or remote permission read. This minimizes operational setup for one private workspace in exchange for serialized writers and a meaningful migration if multi-host authority is later required; it selects no media storage, processing architecture, driver or performance guarantee. Q13's subsequently approved acquisition/contention/error handling is recorded in ADR-0002.

Requirements: MF-SCOPE-02, MF-ACCESS-03/04, MF-CLIENT-01; local MF-AC-04 concurrency/interruption evidence with later admission integration. [Approval and alternatives](../../.scratch/mf-mod-01/technical-discovery.md).
