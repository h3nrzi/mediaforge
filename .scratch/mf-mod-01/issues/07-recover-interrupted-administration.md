# 07: Recover interrupted administration with honest contention and commit outcomes

**What to build:** Clients and operators receive bounded admission waits and accurate refused/indeterminate feedback for every implemented operation, and recover established current facts after interruption without creating another effect or reviving stale authority.

**Blocked by:** [05 — Recover admitted Manager credentials through the trusted host operator](05-recover-manager-credentials.md); [06 — Supply and verify the atomic authority contract for later capabilities](06-verify-shared-authority-boundary.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Implemented under `$implement .scratch/mf-mod-01`; direct dependencies completed in the approved order. Local completion ready for owner review on 2026-10-15.
**Evidence:** [Executed scenario matrix, 50-test result and integration handoff](../../../docs/module-01/verification.md); [full suite output](../test-evidence.txt); [independent review](../review.md).

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§6–10 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q4/Q10–14; ADRs 0002–0004. PRD: MF-SCOPE-02, MF-ACCESS-03/04, MF-CLIENT-01; supporting MF-CLIENT-03 feedback. Local MF-AC-02/04/42 contributions.

Complete systematic adversarial verification and any recovery-path gaps across bootstrap, admission, edits, removal/readmission, replacement/revoke, operator recovery and the approved test consumer. Earlier tickets must already implement their transaction/privacy/error invariants; this ticket does not license unsafe intermediate endpoints or defer all failure handling to the end.

## Acceptance criteria

- [x] Every mutation owns its connection/transaction and acquires BEGIN IMMEDIATE before dependent reads. Immediate nonblocking acquisition with asynchronous bounded backoff uses the same configurable default 1,000 ms cumulative monotonic budget; attempts never reset it or block the event loop with a long synchronous busy timeout. Keep filesystem/network/recipient preparation outside the writer. No other request interleaves inside the transaction.
- [x] Independent writer contention either acquires in budget or returns established 503/refused_without_effect before body execution. Once acquired, validate current authentication, membership/responsibilities, target/version/invariants and fresh gate time. Expiry/replacement/revocation/removal/demotion while waiting gives the appropriate 401/403/409, never a stale-authority effect.
- [x] Distinguish known pre-effect failure, confirmed rollback, indeterminate commit-interface failure and lost transport acknowledgement. Inspect transaction state/error semantics, safely roll back active uncommitted work and discard/quarantine unestablished connections. Neither exception nor autocommit alone proves outcome. Never rerun an executed body or retry failed COMMIT indefinitely.
- [x] 503 marks refused_without_effect only when non-admission/rollback is established; otherwise indeterminate with permitted safe inspection guidance. Fail closed when writable authority/storage cannot be trusted. Reads return only established current facts and no inferred historical actionStatus.
- [x] Recovery covers prepared admission ID; observed membership version/latest bounded facts; saved replacement candidate; exact revocation ID; bootstrap status/candidate; operator target/revision status. Confirmation creates no version, clock, expiry or attribution change. Superseding changes may prevent proof of prior outcomes; preserve that uncertainty without reapplying old intent.
- [x] Restart preserves singleton/initial Manager, actor identity/status/assignments, versions, latest verifier/invalidation metadata, original expiry and attribution. Missing/corrupt store remains unavailable rather than silently initialized. Verify atomic non-destructive migrations preserve these facts; add no speculative migration platform or backup/restore design.
- [x] Complete bounded positive revision overflow and reason-summary coverage on error paths; feedback preserves category/status without truncating supplied identity text or exposing secrets/verifiers/internal traces. No action/event archive or seven-day administrative submission-reference system.
- [x] Extend supported inspection/recovery documentation with known-refusal versus lost-response/indeterminate examples and conservative next steps. All fault/checkpoint/clock controls remain test-construction-only.

## Verification to implement

Primary ownership: **M01-V09, M01-V12, M01-V13, M01-V14**. Complete cross-operation extensions of **M01-V02, M01-V05, M01-V06, M01-V08, M01-V10, M01-V11, M01-V15** and contribute **M01-V17**.

Node test-runner integration tests drive actual HTTP/CLI and real temporary on-disk SQLite. Use barriers and independent writer processes/connections for acquire-success/exhaustion, cumulative wait accounting, no transaction interleaving and credential expiry/change while waiting. Inject only narrow storage-interface faults/checkpoints to distinguish rollback/uncertain commit; count real body executions and inspect durable resource facts afterward. Test actual post-commit process termination/restart and dropped HTTP/command acknowledgement separately from simulated commit-interface uncertainty. Exercise every recovery path, including a subsequent authorized change obscuring prior history and discarded-connection isolation. Never edit records to fabricate an accepted outcome or infer physical power-loss coverage from process termination.

Manual verification: reproduce documented known-contention refusal and lost-response recovery in an isolated local setting; ensure visible results support the proposed next action without raw internal logs or secret-bearing traces. Uninducible physical storage failures remain stated assumptions, not claimed test passes.

## Local evidence and deferred obligations

This closes local administrative durability/uncertainty/current-gate evidence only. Processing outcomes, references/quotas, reconciliation, deletion cleanup and already-authorized transfers are still later capability obligations. Module 01 results cannot be promoted to whole-product acceptance. Ticket 08 consolidates failures/resolutions and the handoff ledger.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.

2026-10-15 — Implemented under the subsequent explicit implementation instruction. Local HTTP/operator/policy-contract verification is recorded in the linked evidence; approved future integration obligations remain outstanding. Canonical triage labels are preserved separately from execution completion. Standards and Spec reviews have no remaining findings. Product Owner local review and V1 acceptance are not claimed.
