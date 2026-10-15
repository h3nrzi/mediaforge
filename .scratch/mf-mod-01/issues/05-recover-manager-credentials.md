# 05: Recover admitted Manager credentials through the trusted host operator

**What to build:** A trusted host operator restores access after Manager credential loss/expiry using the exact admitted Manager's owner-prepared descriptor, preserving their identity and responsibilities and refusing stale or ineligible targets.

**Blocked by:** [04 — Replace and revoke actor credentials without reviving old access](04-replace-and-revoke-credentials.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Implemented under `$implement .scratch/mf-mod-01`; direct dependencies completed in the approved order. Local completion ready for owner review on 2026-10-15.
**Evidence:** [Executed scenario matrix, 50-test result and integration handoff](../../../docs/module-01/verification.md); [full suite output](../test-evidence.txt); [independent review](../review.md).

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§2–3, 5–9 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q6/Q8/Q13–14; ADRs 0002–0004. PRD: MF-SCOPE-02, MF-ACCESS-03/04, MF-CLIENT-01. Local MF-AC-02/04/42 contributions.

Add host-only recovery status/preparation metadata and credential-recovery commands sharing existing domain operations and persistence guards. Ticket 04 supplies credential revision/replacement/confirmation semantics; no second policy system or HTTP override surface.

## Acceptance criteria

- [x] Trusted-host read-only recovery metadata targets an exact existing currently admitted Manager. Actual recovery rechecks target Manager/admission and observed credential revision in the owned immediate transaction; descriptor must target the next revision of that actor.
- [x] Recovery works when all Manager credentials are lost, expired or revoked. It only changes credential state, preserving actor ID/label, membership version/status/assignments, first-admission/historical facts and initialized workspace state.
- [x] Removed, non-Manager, unknown, misbound and stale targets refuse with bounded safe feedback and no effect. A target removed/demoted or newly replaced while the operator waits cannot be restored/overwritten using earlier observations.
- [x] Record bounded operator origin, application time, affected actor/credential and local OS principal metadata. Never fabricate workspace-Manager attribution or trust a caller-supplied workspace actor as operator identity. Retain no unlimited operator archive.
- [x] The operator receives only identity-confirmed owner-prepared registration descriptors, never the raw credential file. Exact-current confirmation preserves original issuance/expiry/revision/attribution; superseded/revoked replay never revives credentials.
- [x] Bootstrap remains initialization-only and always refuses initialized stores. Recovery cannot readmit, grant responsibilities, reset/delete workspace state, edit labels or invoke future capabilities; no network recovery endpoint exists.
- [x] Lost acknowledgements use permitted host metadata and saved-candidate authentication; trustworthy current facts confirm only what can be established. No blind fresh replacement or automatic body replay. Storage uncertainty uses the shared conservative classification and connection disposal.
- [x] Document separate bootstrap/recovery use, exact actor/revision targeting, trusted identity handoff, owner candidate verification and bounded contention/conflict outcomes.

## Verification to implement

Primary ownership: **M01-V11** and completion of the Manager/operator portions of **M01-V08**. Contribute **M01-V01, M01-V09, M01-V12, M01-V13, M01-V14, M01-V17**.

Run real host commands/HTTP with on-disk SQLite. Recover lost/expired/revoked admitted Manager credentials and compare all preserved facts plus explicit operator origin. Test removed/non-Manager/stale/misbound refusal and initialized-bootstrap refusal. Use independent host/HTTP processes and barriers for Manager/operator competing revisions and removal/demotion while recovery waits. Drop a committed recovery acknowledgement, inspect and authenticate the saved candidate, then verify no expiry/revision refresh or duplicate effect. Restart after recovery.

Manual verification: execute the documented total-Manager-loss workflow using recipient-owned preparation and descriptor handoff, without record editing or shared secret files. Verify a removed/non-Manager target remains ineligible.

## Local evidence and deferred obligations

This completes the Module 01 host trust boundary and local Manager-access recovery. It grants no Operations or other capability recovery powers. Physical damaged-storage/host availability recovery and backup architecture are outside approved scope. Ticket 07 completes systematic fault semantics; Ticket 08 preserves explicit integration obligations.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.

2026-10-15 — Implemented under the subsequent explicit implementation instruction. Local HTTP/operator/policy-contract verification is recorded in the linked evidence; approved future integration obligations remain outstanding. Canonical triage labels are preserved separately from execution completion. Standards and Spec reviews have no remaining findings. Product Owner local review and V1 acceptance are not claimed.
