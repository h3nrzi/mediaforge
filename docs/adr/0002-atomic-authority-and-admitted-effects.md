---
status: accepted
---

# Authority changes and admitted effects share an atomic ordering boundary

Approved by the Product Owner on 2026-10-14 in Module 01 discovery Q4: use durable transactions to evaluate current authority, atomically commit membership/responsibility changes and preserve at least one admitted Manager even under competing modifications. Later capabilities must evaluate current authority within the same atomic ordering boundary as their admitted effect, rather than trusting an earlier permission read or credential; this imposes a shared admission contract in exchange for reliable revocation and consistent race outcomes. Already-authorized transfers retain the approved PRD policy; later capability eligibility/processing designs remain outside this decision.

Q10/Q11 were explicitly approved on the same date: SQLite provides persistence under ADR-0004; membership/responsibility/display-label edits require observed-version preconditions, current authority and invariants validated atomically. Stale changes are refused with permitted current facts; absolute desired states and exact credential-ID revocation prevent repetition from adding effects or attribution.

Q13 was explicitly approved on the same date: acquire the writer with BEGIN IMMEDIATE before dependent reads, recheck current authority and expiry at the final application gate, and use a configurable one-second cumulative acquisition-wait budget with retries only before mutation. Never automatically rerun an executed mutation body; distinguish established non-admission, confirmed rollback and indeterminate commit, discard connections with unestablished state and recover through permitted inspection. This accepts bounded contention refusals instead of stale-authority mutation or indefinite waiting; it adds no operation archive or later processing mechanism.

Requirements: MF-SCOPE-02, MF-ACCESS-01/03/04; acceptance lead MF-AC-04 with later-module integrations. [Approval and original alternatives](../../.scratch/mf-mod-01/technical-discovery.md).
