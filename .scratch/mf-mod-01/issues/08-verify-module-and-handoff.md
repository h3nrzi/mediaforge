# 08: Verify the documented Module 01 workflow and hand off local evidence

**What to build:** A future reviewer can reproduce Module 01's real supported actor/operator workflows, see evidence for all seventeen local scenarios and understand exactly which later integrations remain before V1 acceptance.

**Blocked by:** [07 — Recover interrupted administration with honest contention and commit outcomes](07-recover-interrupted-administration.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Blocked by 07; dependency completion required before execution. Awaiting a separate explicit implementation instruction.
**Evidence:** Not executed.

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§8–10, Testing Decisions including Acceptance coverage and local completion gate, Out of Scope and Further Notes; [Technical Discovery](../technical-discovery.md) Q1–14 and final readiness records; accepted ADRs 0001–0004; approved Module Plan completion rules/coverage ledger. PRD owned requirements: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01. Evidence lead: MF-AC-02/03/04; local/future contributions MF-AC-01/29/33/37/38/41/42/44.

Consolidate documentation and actual evidence after implementation. The ticket is Module 01 verification/handoff, not MF-GATE-07 or authorization to begin Module 02. Earlier tickets incrementally document/test their complete slices; do not turn this into a catch-all for missing core behavior.

## Acceptance criteria

- [ ] A reproducible starting point documents pinned runtime, persistent local database, transport/HTTPS requirements, owner preparation, descriptor identity confirmation, one-time bootstrap, supported commands and actor-specific curl setup. Use curl 8.x with --disable first, owner-only configs, --json request files, --fail-with-body, no automatic redirects and no TLS bypass; jq optional. No secrets in literal arguments, shell history, version control, evidence or traces; no owner-file handoff to Managers/operators.
- [ ] Execute actual HTTP/command workflows for admission, zero/alone/combined responsibilities, self identity/current authority, management denials, stale changes, safe removal/readmission, self/Manager replacement, exact revoke and operator-only recovery. Show stable actor IDs, assignments/versions, original expiry, bounded attribution and permitted current facts. Future media features are explicitly scheduled, never successful placeholder endpoints.
- [ ] Verify complete specified HTTP semantics (400/401/403/404/409/413/503), JSON result/reason/action-status fields, no-store, no unauthorized target disclosure, redirect/ambient-config avoidance and readable safe recovery. Include established contention refusal and indeterminate outcome handling.
- [ ] Execute and record M01-V01 through M01-V17 with scope, method, actual observations, artifact/test references, failures and resolutions. Retain secret-free evidence; distinguish HTTP/host operation evidence, local policy-contract evidence, controlled clock/fault results and manual review. Unexecuted/failed items cannot be marked passed or hidden by aggregate counts.
- [ ] Run the full applicable suite and repository checks once final changes settle; use meaningful feature tests and the existing JavaScript/runtime checking conventions rather than adding a compiler/framework solely for this ticket. Resolve failures or explicitly report the module incomplete.
- [ ] Verify all five owned PRD requirements against specification/ticket coverage and acceptance contributions. MF-AC-02/03/04 remain partial local evidence until the named full-scenario participants supply real subjects; record MF-AC-01/42/44 local scope and outstanding MF-AC-29/33/37/38/41 subjects.
- [ ] Produce a handoff ledger naming Modules 02–06 and MF-GATE-07, boundary/client conventions delivered, outstanding real integration scenarios, storage assumptions and any material limitations. No fabricated learner mastery/performance SLA, edited outcomes, physical power-loss claims or whole V1 pass.
- [ ] State whether Module 01 local completion evidence is ready for owner review, independently of full V1 acceptance and later-module authorization. Preserve approved decisions; a genuine blocking contradiction must be reported rather than silently changed.

## Verification to implement and perform

Primary ownership: **M01-V17** and final coverage audit/rerun of **M01-V01–M01-V16**. Earlier scenario owners retain responsibility for their tests; this ticket collects evidence rather than duplicates their implementation.

Automate the documented curl walkthrough against actual HTTP and helper/operator commands with a real on-disk isolated store, asserting meaningful identities, versions, statuses and no effects on refused/repeated actions. Test an ambient curl config and redirect response without transmitting credentials to an unintended destination. Use the existing controlled contention/fault harness for readable 503/refused and indeterminate evidence. Scan tracked artifacts/transcripts/logs for generated test secrets and forbidden stored-verifier exposure; never emit secrets in a failure report.

Manual verification is required: run the walkthrough from its documented starting point, review file permissions/identity handoffs and human-readable recovery/error guidance, inspect secret-free collected evidence and confirm local-versus-integration labels. No hand-authored successful transcripts.

## Mandatory integration handoff

| Consumer | Evidence still required with real subjects |
| --- | --- |
| Module 02 | Source admission/read/retrieval and each listing continuation use current authority; quotas/reference recovery/provenance/common feedback remain its ownership |
| Module 03 | Actual shared-source Contributor admissions, authoritative request submitter, retained work/counters/outcomes after membership removal; no Manager inheritance |
| Module 04 | Own/other eligible retry/cancellation and Operations-only checks/safe provisional cleanup; MF-AC-29 and responsibility combinations |
| Module 05 | Reviewer actions/stale edits/revocation and actual output/preview reads; MF-AC-33 |
| Module 06 | Manager deletion/follow-up, new versus already-authorized transfers, dependency-pinned stable attribution/history; MF-AC-37/38 |
| MF-GATE-07 | Complete original MF-AC-02/03/04 plus MF-AC-01/29/33/37/38/41/42/44 contributions, full matrix/release/educational evidence review and Product Owner V1 acceptance |

All integrations remain outstanding until executed by their named participants. Module 01 policy-contract tests supply no fabricated media, quota or lifecycle acceptance.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.
