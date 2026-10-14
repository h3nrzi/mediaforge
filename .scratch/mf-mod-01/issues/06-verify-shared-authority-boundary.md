# 06: Supply and verify the atomic authority contract for later capabilities

**What to build:** Later capability owners can use one authority boundary that checks the current actor at their final admission gate, supplies stable attribution and commits their admitted change in the same owned transaction. Verify the full responsibility matrix locally through the specification's minimal test consumer.

**Blocked by:** [04 — Replace and revoke actor credentials without reviving old access](04-replace-and-revoke-credentials.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Blocked by 04; dependency completion required before execution. Awaiting a separate explicit implementation instruction.
**Evidence:** Not executed.

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§2, 7, 10 and Testing Decisions (primary seams/local policy consumer); [Technical Discovery](../technical-discovery.md) Q1–4/Q9–14; ADRs 0001–0004. PRD: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; consumer obligations MF-ACCESS-02/05/06. Local MF-AC-02/03/04 contract evidence; future MF-AC-29/33/37/38/41 contributions.

This is the approved contract-verification increment, not a new media feature. Complete the small boundary already used by management; avoid speculative abstractions, generic infrastructure and future processing design. Ticket 04 gates testing current credential replacement/revocation and membership lifecycle through this boundary. Operator recovery is not a technical prerequisite.

## Acceptance criteria

- [ ] Boundary takes authenticated proof, action kind and authoritative subject facts, evaluates current credential/membership/responsibilities/ownership at the final gate and supplies stable actor ID/action-time label/time within the same owned transaction as the consumer's admitted change. Proof remains confined to the boundary; no reusable authorization boolean escapes a closed transaction and consumers cannot independently commit after a preliminary/remote permission read.
- [ ] Cover every approved kind: admitted-member shared read; Contributor source/new-request admission; Contributor own-request or Operations any-request retry/cancel; Reviewer selection; Operations evidence checks/provisional cleanup; Manager membership/responsibility management and accepted-media deletion/follow-up. Unknown kinds deny.
- [ ] Zero-role admitted members have shared-read policy; assignments union only permitted actions. Manager has no Contributor/Reviewer/Operations inheritance. Request submitter facts, not source-uploader identity or caller assertions, determine own-request power. Any Contributor may request a shared source subject to consumer eligibility.
- [ ] Current expiry/replacement/revocation/removal/demotion wins after waiting. Consumer writes roll back with failed authority/eligibility; no separate authority snapshot can authorize an effect. Short fresh read scopes permit an already-authorized read to finish, but recheck every new call/page.
- [ ] Removal/relabeling preserves test-consumer admitted facts and stable attribution without cancellation, accounting release or historical rewrites. Authoritative dependencies prevent actor deletion; no fake production endpoints, actual quota/lifecycle system or unlimited receipt archive is added.
- [ ] Document the boundary's inputs, transaction ownership, denial/error semantics, secret confinement and consumer responsibility for authoritative subjects, eligibility/quotas/lifecycle and retained dependencies. Carry already-authorized transfer policy forward without building transfer mechanics.

## Verification to implement

Primary ownership: **M01-V04** (complete policy-contract matrix). Complete the local zero-role/unauthorized boundary portions of **M01-V03** and contribute **M01-V07, M01-V09, M01-V12, M01-V13, M01-V17**.

Use helper/HTTP-created actors, actual assignments and real SQLite authority operations plus a minimal construction-only test consumer. Test each role alone, zero roles, combinations/all roles, unknown kinds and own/other request submitter distinct from uploader. Exercise consumer refusal/rollback and admission-versus-revocation ordering with barriers; assert stable test-consumer attribution after relabel/removal/readmission. Do not mock the gate or edit outcomes to claim real workflow acceptance. Label every consumer result policy-contract verification. Ticket 07 completes deterministic contention/commit faults across these paths.

Manual verification: review the documented consumer contract against the approved responsibility matrix and Module Plan ownership ledger. There is no manual media demonstration for this ticket because those capabilities do not yet exist.

## Local evidence and deferred obligations

Module 02 must integrate actual source/read/continuation authority; Module 03 supplies request ownership/admission and work continuity; Module 04 supplies eligible retry/cancel/Operations facts; Module 05 supplies real review; Module 06 supplies deletion/transfer and dependency lifetimes. Policy-contract passes cannot close their full MF-AC-02/03/04 or other real-subject cases. Ticket 08 records each named participant and outstanding evidence.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.
