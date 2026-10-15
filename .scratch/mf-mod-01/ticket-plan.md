# MF-MOD-01 — Implementation ticket plan and coverage index

Plan approval: **Explicitly approved by the Product Owner on 2026-10-14**.
Prepared: 2026-10-14.
Triage status: **ready-for-agent** records the approved specification readiness; execution completion is tracked separately.
Implementation / executed verification: **All eight tickets implemented under the subsequent `$implement .scratch/mf-mod-01` instruction.** Dependencies were completed in order (01→02→03→04→05/06→07→08). On 2026-10-15, 50 tests and runtime/syntax checks passed; independent Standards and Spec reviews report zero remaining findings. [Local evidence and integration handoff](../../docs/module-01/verification.md). Owner review and whole V1 acceptance remain pending.

The approval-only and dependency-readiness statements below describe the historical ticket-generation session; approved scope and dependency edges are preserved.

## Authority and generation scope

The [specification's Product Owner Approval Record](spec.md#product-owner-approval-record) explicitly approves the complete Module 01 specification on 2026-10-14, including HTTP/operator-command seams and M01-V01–M01-V17. The current user instruction separately authorizes ticket generation and requires this review gate before implementation. Earlier approval-only prohibitions in the specification/discovery are historical session restrictions; their product/technical content remains unchanged. The Module Plan records PRD/plan approval despite historical pending text in the PRD. No context file or approved decision was edited.

Applied the installed [to-tickets skill](../../.agents/skills/to-tickets/SKILL.md): complete verifiable slices, one local file per ticket and explicit blocking edges. It names no additional skill dependency. The user expressly requested files before the review gate, so generation precedes approval of the breakdown here. The separately supplied implement skill is **not invoked**. Repository tracker/triage/domain instructions, PRD, Module Plan, complete Module 01 specification/discovery, glossary and accepted ADRs 0001–0004 were consumed. No application code exists to prefactor; no technical setup-only ticket is needed.

Product Owner evaluation is complete. Under the canonical triage vocabulary, all eight approved and fully specified tickets are `ready-for-agent`; dependency blocking remains recorded separately in each ticket’s unchanged `Blocked by` field. Only Ticket 01 is currently unblocked. Readiness does not indicate implementation completion or authorize execution in this approval-recording session. Ticket numbering is local to MF-MOD-01, distinct from module IDs and MF-GATE-07.

## Ordered tickets and direct dependencies

| Ticket | Objective / independently verifiable increment | Direct blockers |
| --- | --- | --- |
| [01 — Establish durable private workspace and initial Manager access](issues/01-establish-private-workspace.md) | Prepare owner-held credentials, initialize once and authenticate the Manager against durable authority | None |
| [02 — Admit actors and manage current labels and responsibilities](issues/02-manage-actors-and-responsibilities.md) | Manager admissions/edits, self inspection, exact lookup and bounded directory with stale-version protection | 01 |
| [03 — Remove and readmit exact actors while preserving Manager authority](issues/03-remove-and-readmit-members.md) | Immediate membership invalidation, explicit fresh readmission and concurrent last-Manager protection | 02 |
| [04 — Replace and revoke actor credentials without reviving old access](issues/04-replace-and-revoke-credentials.md) | Self/Manager replacement, expiry, exact revoke and replay-safe candidate recovery across membership states | 03 |
| [05 — Recover admitted Manager credentials through the trusted host operator](issues/05-recover-manager-credentials.md) | Credential-only recovery with exact admitted-Manager targeting, revision protection and operator origin | 04 |
| [06 — Supply and verify the atomic authority contract for later capabilities](issues/06-verify-shared-authority-boundary.md) | Full policy matrix and same-transaction consumer contract with stable attribution | 04 |
| [07 — Recover interrupted administration with honest contention and commit outcomes](issues/07-recover-interrupted-administration.md) | Complete waiting/fault/restart/recovery evidence across all implemented entry points | 05, 06 |
| [08 — Verify the documented Module 01 workflow and hand off local evidence](issues/08-verify-module-and-handoff.md) | Real curl walkthrough, all-scenario evidence audit and explicitly scoped integration handoff | 07 |

Approved execution order: **01 → 02 → 03 → 04 → 05 → 06 → 07 → 08**. Tickets 05 and 06 are independently eligible after 04; choosing 05 first is an execution preference, not a blocking edge. Work the approved frontier only when all direct blockers are complete. Transitive edges are omitted: 07 gates on both branches; 08 therefore gates on all implementation increments.

Dependencies reflect required behavior: 02 needs an actual Manager/service; 03 needs admitted actors and versioned edits; 04 must verify replacement/replay against removed/readmitted identities; 05 needs credential revision/confirmation mechanics; 06 needs all current credential and membership states; 07 needs every entry point plus the consumer contract; 08 needs finished fault/recovery behavior. No later module blocks local Module 01 verification.

Every implementation ticket delivers behavior, relevant persistence/adapter changes, tests and incremental documentation. Ticket 01 introduces only infrastructure necessary for the real bootstrap/self-inspection flow. Ticket 06 is the specification's explicitly approved contract slice using a minimal test consumer, not a future feature. Ticket 07 completes the interrupted-action recovery path and adversarial matrix; safety invariants already apply in each earlier increment. Ticket 08 is a local verification/handoff gate, not full V1 acceptance.

## Verification scenario ownership

Owner means accountable for full scenario coverage with the stated supporting tickets. Supporting increments establish pieces earlier; the completion frontier names the last prerequisite for complete local coverage. Ticket 08 audits and executes the consolidated matrix after all frontiers. **Every row is planned, unexecuted evidence.**

| Scenario | Accountable ticket | Supporting tickets / complete-local frontier | Planned observable evidence |
| --- | --- | --- | --- |
| M01-V01 | 01 | 04, 05, 08; complete audit 08 | Owner-only durable preparation, secret-free descriptor/server/output/evidence, unsafe destination denial |
| M01-V02 | 01 | 07; frontier 07 | Atomic Manager-only bootstrap, pre/post-commit interruption, independent competing processes, immutable rerun and saved candidate |
| M01-V03 | 02 | 01, 03, 04, 06; frontier 06 | Anonymous/malformed/wrong-secret/verifier/expired/removed denial, actual zero-role self access and management denial, no target leakage |
| M01-V04 | 06 | 02, 03, 04; frontier 06 | Actual assignments/management permissions plus all policy kinds, role combinations, request submitter versus uploader |
| M01-V05 | 03 | 02, 07; frontier 07 | Independent competing self/other Manager demotions/removals, one safe order, exact committed versions/attribution |
| M01-V06 | 02 | 03, 07; frontier 07 | Stale edits/removal/readmission replay, desired-state no-ops and no repeated version/attribution |
| M01-V07 | 03 | 02, 04, 06; frontier 06 | Removed assignment/credential invalidation, exact fresh readmission, duplicate labels/new IDs, permanent old-token denial, stable snapshots |
| M01-V08 | 04 | 05, 07; frontier 07 | Self/other replacement authority, Manager/operator revision races, exact candidate confirmation and denied old replay |
| M01-V09 | 07 | 01, 03, 04, 05, 06; frontier 07 | Before/at/after 30 days, unchanged expiry on recovery, expiry/replacement/removal/demotion while acquiring writer |
| M01-V10 | 04 | 03, 07; frontier 07 | Exact revoke/repeat/old-ID after replacement, unchanged membership and responsibilities |
| M01-V11 | 05 | 07; frontier 07 | Admitted-Manager credential recovery, operator origin, removed/non-Manager/stale denial, no bootstrap recovery |
| M01-V12 | 07 | 01, 05, 06; frontier 07 | Independent writer holds, success/exhaustion, cumulative budget, zero body execution before acquisition and isolated transactions |
| M01-V13 | 07 | 01–06; frontier 07 | Pre-effect/rollback/uncertain commit/dropped response classifications, no body rerun, connection disposal, only established inspection facts |
| M01-V14 | 07 | 01, 03, 04, 05; frontier 07 | Actual restart preserving authority/verifier/expiry/attribution; missing/corrupt store fails closed |
| M01-V15 | 02 | 01, 04, 07; frontier 07 | Exact/excess Unicode bounds versus format validity, invalid fields/roles, revision overflow, bounded reasons/no effect |
| M01-V16 | 02 | 03; frontier 03 | Default/max/invalid pages, exact filters/tie-break, current status and denied continuation after Manager demotion |
| M01-V17 | 08 | 01–07; frontier 08 | Executed real curl/command walkthrough, specified HTTP feedback/no-store, ambient-config/redirect/secret protections |

## Specification and requirement coverage

| Specification area | Implementation owners | Verification focus |
| --- | --- | --- |
| Decisions §1 — Cohesive service / approved runtime and replaceable synchronous SQLite adapter | 01; reused 02–07 | Real service/commands and runtime checks; no extra frameworks |
| §2 — Singleton, actors, bounded membership/credential attribution, versions, limits and invariants | 01–05; contract 06; adversarial completion 07 | V02/05/06/07/08/10/11/14/15 |
| §3 — Material, authentication, canonical encodings, revision-bound locators, file safety, fixed expiry | 01, 02, 04, 05; waiting 07 | V01/03/08/09/10/15 |
| §4 — Admission, absolute edits, removal, fresh exact-ID readmission and stable snapshots | 02, 03 | V04/05/06/07/16 |
| §5 — Self/Manager replacement, exact revoke, narrow operator recovery | 04, 05 | V08/09/10/11 |
| §6 — Bootstrap/status, explicit store/startup, verified WAL/FULL/FKs, protected files, atomic non-destructive migrations | 01; full lifecycle verification 07 | V02/12/13/14 |
| §7 — Owned transaction, fresh final authority/time, bounded acquisition, conservative failure state, fresh reads | Every operation 01–06; complete matrix 07 | V05/08/09/12/13/14/16 |
| §8 — All specified HTTP operations, JSON/error/privacy/body/transport guard, management directory and curl conventions | 01–04; incremental command docs 05; consolidated client 08 | V03/06/15/16/17 plus 503/uncertainty in 07 |
| §9 — Resource/version/candidate/exact-ID recovery; trustworthy facts versus unprovable earlier outcomes | Each slice 01–05; complete interrupted flow 07 | V02/06/08/10/11/13 |
| §10 — Stable atomic consumer authority, complete policy kinds, no access/work cascade and integration ownership | 06; handoff 08 | V04/local policy; current-gate races V09/12/13; later real subjects outstanding |
| Testing Decisions — HTTP/commands + real SQLite, construction-only clock/fault controls, independent race barriers | Every ticket; evidence audit 08 | All V01–V17, never fabricated outcomes |
| Local completion gate, Out of Scope and Further Notes | Every ticket; accountable handoff 08 | Scoped evidence/limitations and named future acceptance participants |

| Owned PRD requirement | Accountable implementation coverage | Local acceptance contribution / remaining scope |
| --- | --- | --- |
| MF-SCOPE-02 | 01, 02, 03, 06 | MF-AC-02 current authority and management directory; actual shared records/media in 02/03/05/06 modules |
| MF-ACCESS-01 | 01, 02, 04, 05, 06 | MF-AC-03 assignments, real management denials and policy contract; actual capability actions in modules 02–06 |
| MF-ACCESS-03 | 03, 04, 06, 07 | MF-AC-04 future-authority revocation/current gate; actual work/counters/transfers in modules 03/06 |
| MF-ACCESS-04 | 01, 02, 03, 04, 05, 07 | MF-AC-04 concurrent last Manager/stable local identity; dependent media attribution in later modules |
| MF-CLIENT-01 | 01–05 incremental workflows; 06 extension contract; 07 recovery; 08 accountable consolidated walkthrough | Local MF-AC-01/02/03/04/42; sample media and actual processing/review/Operations/deletion workflows later |

Supporting MF-RESOURCE-06/MF-HISTORY-01/02/MF-CLIENT-02/03 and consumer MF-ACCESS-02/05/06 references do not transfer those requirements' ownership or authorize their implementations.

## Cross-module evidence ledger

This ledger starts with **no completed implementation evidence**. Future local passes must retain the exercised scope and outstanding rows rather than turn partial evidence into a full acceptance pass.

| Acceptance obligation | Planned Module 01 contribution | Later real integration required |
| --- | --- | --- |
| MF-AC-02 (01 evidence lead) | Actor/authentication/management boundaries and shared-read policy | Modules 02/03/05/06: actual accepted records, listings/continuations, sources/requests/outputs/history/media retrieval and denials |
| MF-AC-03 (01 evidence lead) | Actual assignments and management denials; policy matrix including own/other submitter | Modules 02–06: actual Contributor/Reviewer/Operations/Manager actions; 03 provides authoritative request ownership |
| MF-AC-04 (01 evidence lead) | Competing last-Manager changes, revocation/expiry gates, stable local snapshots and recovery | Module 03: admitted work/slots/outcomes remain after removal; Module 06: already-authorized transfer/deletion races |
| MF-AC-01 | Starting point and honest local advertised scope | Module 02 sample/entry flow and gate 07 full release-scope/client review |
| MF-AC-29 | Cancel-policy authority without removal-issued cancellation | Modules 03/04 actual request scope, descendants, outputs and repeated cancellation |
| MF-AC-33 | Reviewer policy and current-state revocation boundary | Module 05 actual selections/stale state/attribution and downloads |
| MF-AC-37 | New access denial versus prior authorized-read distinction | Modules 02/03/05/06 actual transfers, pending cleanup/capacity and follow-up |
| MF-AC-38 | Immutable actor/first-admission snapshots; no identity purge/cascade | Modules 02–06 actual dependency-pinned provenance/lineage/selection/deletion/history facts |
| MF-AC-41 | Bounded actor directory and denied continuation | Modules 02–06 applicable record filters, expiry, availability and continuation |
| MF-AC-42 | Readable local permission/conflict/input/contention/uncertainty feedback | Module 02 lead and 03–06 all later categories and safe real recovery workflows |
| MF-AC-44 | Actual secret-free local evidence and explicit limitations | Gate 07 complete matrix, owner rendering-reference/evidence review and educational discussion with modules 01–06 |

## Key risks and verification treatment

- **Stale authority after waiting:** own the transaction before dependent reads and take fresh gate time; independent barriers exercise V05/V08/V09/V12. No cached boolean or preliminary remote check authorizes later effects.
- **False refusal or duplicate effects after uncertain commit:** distinguish non-admission/rollback/indeterminate, discard unknown connections and inspect saved resources/candidates/exact IDs; V02/V13/V14. Current state may not prove superseded history, so recovery must preserve uncertainty.
- **Secret leakage or recipient misbinding:** owner-only flushed artifacts, identity-confirmed descriptor handoff, strict proof parsing and redacted output; V01/V03/V08/V17. Stored verifier is never an authenticator or roster output.
- **Revision/no-op and last-Manager races:** current versions plus exact IDs, fresh locators and atomic invariant checks; V05–V11/V15. Credential expiry does not demote a Manager; host recovery preserves their existing authority.
- **Storage/runtime assumptions:** approved pinned Node API and small adapter, verified single-host local SQLite configuration/protected sidecars/fail-closed startup; V12–V14. Process interruption tests demonstrate restart persistence, not physical power-loss or damaged-storage recovery guarantees.
- **Partial evidence mistaken for acceptance:** label local HTTP/CLI versus policy-contract evidence and preserve the integration ledger; Ticket 08 audits all seventeen scenarios without claiming full MF-AC-02/03/04 or V1 acceptance.

## Readiness and execution gate

Ticket 01 has no technical blockers, an approved specification and agreed HTTP/host-command seams. Its prerequisites and acceptance criteria are completely defined; the acceptance criteria have not been implemented or verified. It is `ready-for-agent` and unblocked for a later explicitly authorized implementation session. There is no known blocking contradiction and no reason to reopen Technical Discovery.

Tickets 02–08 are fully specified and `ready-for-agent` for triage purposes, but remain blocked by the unchanged direct dependencies above. None has been started, claimed or completed. All acceptance checkboxes remain unchecked and all verification evidence remains unexecuted.

This session authorizes documentation and status updates only. Do not invoke implement, write or modify application code, execute any ticket, start Module 02, modify the approved specification/Final PRD/Module Plan or claim any tests or acceptance criteria passed. Stop after recording approval and statuses; await a separate explicit instruction to begin implementation.

## Product Owner Approval Record

**Approval date:** 2026-10-14.

The Product Owner explicitly stated: “I explicitly approve the eight-ticket implementation plan for **MF-MOD-01 — Private Workspace and Member Authority**.”

Approval includes all eight tickets (01–08), their scope, dependencies and execution order, the complete M01-V01–M01-V17 coverage index, cross-module integration obligations and the final Module 01 verification/handoff ticket. Approved ticket boundaries, dependency edges and verification coverage are preserved.

The Product Owner separately restricted this session to recording approval and updating documentation/statuses. Ticket-plan approval establishes planning readiness; no implementation, ticket execution, Module 02 work, test pass or acceptance result is authorized or recorded by this update.

| Ticket | Triage status | Dependency readiness |
| --- | --- | --- |
| 01 | ready-for-agent | Unblocked; prerequisites and acceptance criteria fully defined; awaiting separate execution instruction |
| 02 | ready-for-agent | Blocked by 01 |
| 03 | ready-for-agent | Blocked by 02 |
| 04 | ready-for-agent | Blocked by 03 |
| 05 | ready-for-agent | Blocked by 04 |
| 06 | ready-for-agent | Blocked by 04 |
| 07 | ready-for-agent | Blocked by 05 and 06 |
| 08 | ready-for-agent | Blocked by 07 |
