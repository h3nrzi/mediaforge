# 04: Replace and revoke actor credentials without reviving old access

**What to build:** Admitted members replace or revoke their own credential without Manager authority; Managers administer another admitted actor's credential with exact targeting and revision conflict protection. Saved candidates recover lost responses without renewing the same registration.

**Blocked by:** [03 — Remove and readmit exact actors while preserving Manager authority](03-remove-and-readmit-members.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Blocked by 03; dependency completion required before execution. Awaiting a separate explicit implementation instruction.
**Evidence:** Not executed.

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§2–5, 7–9 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q6–7/Q11/Q13–14; ADRs 0001–0004. PRD: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting MF-RESOURCE-06 and local MF-CLIENT-03 feedback. Local MF-AC-02/03/04/42 contributions.

Implement ordinary credential replacement and exact-ID revocation HTTP operations plus owner preparation using observed non-secret metadata. Operator-only recovery stays in Ticket 05. Ticket 03 genuinely gates full replay/invalidation behavior against removed/readmitted actors.

## Acceptance criteria

- [ ] Self replacement requires the valid exact currently authenticating credential, admitted membership and current revision; no Manager responsibility. It cannot target another actor. A Manager targeting self uses this same guard. Expired/revoked/removed callers cannot renew themselves.
- [ ] Third-party Manager replacement requires current Manager authority, currently admitted exact target and observed credential revision. Fresh prepared descriptors bind exact actor, intended next revision, locator and verifier; stale conflicts are 409 without mutation or unauthorized facts. One active credential remains after commit.
- [ ] Actual registration/replacement/revocation advances credential revision once; credential-only changes never alter membership version/assignments/identity/first admission. No-op confirmations and refused actions add no revision/time/attribution. Revision exhaustion cannot wrap or partially invalidate old access.
- [ ] Issuance uses fresh server gate time, expiry exactly 30 elapsed days later. Before/exactly-at/after checks, downtime and waiting use current trusted UTC time; no background expiry transition, idle timeout, refresh token or automatic renewal. Inspection and exact-current confirmation never extend lifetime.
- [ ] Authorized exact-current non-revoked candidate confirmation preserves original issuance/expiry/revision/attribution. Conflicting bindings, superseded/revoked locators or stale mutation preconditions cannot re-register old material. Another authorized Manager may inspect a time-expired registration without renewing it.
- [ ] Exact-ID revoke is permitted to current authenticated owner or a current Manager for another admitted actor. It never redirects to whichever credential is current later. Repeated revocation adds no effect and replaying an old ID cannot revoke a replacement; disclose only bounded latest facts, without an event archive.
- [ ] Self replacement invalidates the old credential atomically; saved-candidate authentication and metadata inspection recover a lost acknowledgement. After self-revocation, another Manager may be needed for inspection/replacement; failed authentication or stale conflicts alone do not prove a prior uncertain action never committed.
- [ ] Helper/private-file protections, trusted identity handoff, strict bearer parsing, redacted logs, no-store and common HTTP action-status/error semantics hold for every new operation. Extend curl instructions for preparation, self/Manager replacement, exact revoke, expiry and recovery.

## Verification to implement

Primary ownership: **M01-V08, M01-V10**, and expiry/no-extension portions of **M01-V09**. Contribute **M01-V01, M01-V03, M01-V07, M01-V13, M01-V14, M01-V15, M01-V17**. Ticket 05 adds Manager/operator replacement races; Ticket 07 owns complete waiting-authority V09 evidence.

Automate real HTTP flows with zero-role owners, Managers and denied non-Managers. Cover exact self/other guards, fresh/misbound descriptors, concurrent Manager replacements, current confirmation, superseded/revoked replay, removal/readmission and revision exhaustion. With controlled clock, test every expiry boundary and unchanged metadata on reads/recovery. Drop responses after replacement/revoke, authenticate saved candidates and assert old credential denial, exact versions and no repeated attributed effect. Restart and verify durable verifier status/original expiry. After Ticket 05, race Manager replacement against host recovery with the same observed revision.

Manual verification: execute replacement and revocation curl examples, including old-config denial and safe candidate inspection. Confirm the Manager/operator receives only recipient-confirmed descriptor material.

## Local evidence and deferred obligations

Local credential administration does not cancel work, demote actors, reset bootstrap or grant future capability eligibility. Later admitted-work/accounting continuity remains Modules 03/06 evidence; Module 02 submission-reference recovery is not introduced here. Complete cross-operation uncertainty is Ticket 07; consolidated acceptance accounting is Ticket 08.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.
