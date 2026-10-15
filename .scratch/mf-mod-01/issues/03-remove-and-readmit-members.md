# 03: Remove and readmit exact actors while preserving Manager authority

**What to build:** A Manager revokes membership immediately and can explicitly readmit the same actor with fresh prepared credentials and chosen responsibilities, while concurrent changes always preserve an admitted Manager and stable historical identity.

**Blocked by:** [02 — Admit actors and manage current labels and responsibilities](02-manage-actors-and-responsibilities.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Implemented under `$implement .scratch/mf-mod-01`; direct dependencies completed in the approved order. Local completion ready for owner review on 2026-10-15.
**Evidence:** [Executed scenario matrix, 50-test result and integration handoff](../../../docs/module-01/verification.md); [full suite output](../test-evidence.txt); [independent review](../review.md).

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§2–4, 7–10 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q2/Q4/Q7/Q9–11/Q13–14; ADRs 0001–0004. PRD: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting MF-HISTORY-01/02 and MF-RESOURCE-06 contracts. Local MF-AC-02/03/04/38/42 contributions.

Implement explicit remove/readmit HTTP operations and expand existing edits/directory tests. Reuse prepared descriptor and current metadata flows; this slice needs no ordinary credential replacement endpoint.

## Acceptance criteria

- [x] Removal with observed membership version atomically clears assignments, marks removed and invalidates usable credential state. Advance membership version once and credential revision only when credential state actually changes. Already-invalid credentials do not manufacture another revocation; every subsequent authenticated call by the removed actor denies.
- [x] Exact-ID repeat removal adds no version/time/attribution/effect. Stale removal after readmission refuses and cannot remove the new admission. Repetition of a past label/assignment change after an intervening incompatible change also refuses.
- [x] Readmission targets an existing removed actor with observed membership and credential revisions, explicit assignments (including empty) and fresh next-revision owner-prepared material. Recheck Manager authority/state/binding at the gate and commit admission/assignments/credential atomically. Never restore old responsibilities or credentials, or reactivate by label matching/new-admission replay.
- [x] Retain actor ID, first-admission identity/time/order and immutable attribution snapshots. A different person with the same label receives a new ID. Current label edits/readmission do not rewrite historical action-time labels.
- [x] Last-Manager counting considers admitted Manager membership, including expired/revoked credentials. Removal and responsibility edits, including self-actions and competing independent writers, cannot commit zero admitted Managers. A caller demoted/removed while waiting cannot act using earlier authority.
- [x] Membership changes have no cascades into work/media/history, cancellation intent or accounting release. Preserve foreign-key actor dependencies, bounded latest-change facts and original first-admission facts; introduce no purge/event archive.
- [x] Return readable current permitted facts for conflicts, denied next pages after removal/demotion and safe exact-ID lookup after a lost acknowledgement. Inspecting current state cannot falsely prove a superseded historical outcome.
- [x] Extend documented curl workflows for safe self-demotion with another Manager, removal, old-credential denial, exact-ID readmission and stale-removal recovery.

## Verification to implement

Primary ownership: **M01-V05, M01-V07** and completion of removal/readmission portions of **M01-V06**. Contribute **M01-V03, M01-V09, M01-V10, M01-V13, M01-V14, M01-V16, M01-V17**.

Use actual HTTP/host setup and on-disk SQLite with barriers and independent connections/processes for two-Manager competing self/other demotions/removals. Assert one ordered outcome, at least one admitted Manager, exact versions/attribution and current-caller denial where applicable. Exercise removal/readmission repeats and stale old intents, label duplicates, fresh credential binding, permanent old-secret denial and stable first-admission snapshots. Drop a committed removal/readmission response and recover permitted facts without new effects. Restart after removal/readmission and verify identity, versions, credential status and original expiry. After Ticket 04, extend to already-revoked credentials and old-candidate replay.

Manual verification: follow removal/readmission instructions using separately owned actor configs and shareable descriptors; compare stable actor/first-admission facts and new explicit assignments without secret-bearing transcripts.

## Local evidence and deferred obligations

Real membership/credential invalidation and historical local snapshots are owned here. Actual admitted processing continuity, retained counters/outcomes and previously authorized download behavior need Modules 03/06; no fake work/media endpoint or accounting implementation may be introduced to claim them passed. Returning actors retain request-submitter identity, but real own-request eligibility is Modules 03/04 evidence.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.

2026-10-15 — Implemented under the subsequent explicit implementation instruction. Local HTTP/operator/policy-contract verification is recorded in the linked evidence; approved future integration obligations remain outstanding. Canonical triage labels are preserved separately from execution completion. Standards and Spec reviews have no remaining findings. Product Owner local review and V1 acceptance are not claimed.
