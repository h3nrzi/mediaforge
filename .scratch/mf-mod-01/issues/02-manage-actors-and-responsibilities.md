# 02: Admit actors and manage current labels and responsibilities

**What to build:** An authenticated Manager admits explicitly identified people with prepared credentials, finds exact actors through a bounded directory and changes labels or complete responsibility sets without overwriting another Manager's newer decision. Admitted members inspect their own current authority.

**Blocked by:** [01 — Establish durable private workspace and initial Manager access](01-establish-private-workspace.md).

**Status:** ready-for-agent
**Plan approval:** Explicitly approved by the Product Owner on 2026-10-14.
**Execution readiness:** Blocked by 01; dependency completion required before execution. Awaiting a separate explicit implementation instruction.
**Evidence:** Not executed.

## Authoritative context and scope

Parent: MF-MOD-01. [Specification](../spec.md) Implementation Decisions §§2–4, 7–9 and Testing Decisions; [Technical Discovery](../technical-discovery.md) Q2–4, Q6/Q9/Q11–14; ADRs 0001–0004. PRD: MF-SCOPE-02, MF-ACCESS-01/03/04, MF-CLIENT-01; supporting MF-RESOURCE-06 and the local application of MF-CLIENT-02/03, whose common later-subject ownership remains Module 02. Local MF-AC-02/03/04/38/41/42 contributions.

Implement PUT/PATCH actor operations, GET exact actor, GET bounded actors and permitted non-secret credential metadata. Membership removal/readmission is Ticket 03; credential replacement/revocation is Ticket 04. Every operation inherits Ticket 01's durable transaction, current-authentication, error, privacy and transport contract.

## Acceptance criteria

- [ ] Manager-only admission atomically creates caller-prepared actor ID, current label, explicit assignments, membership version/credential revision at one and the first verifier. Validate descriptor actor/revision/binding and trusted recipient-confirmation workflow; no secret file transfer. Existing IDs cannot be overwritten or implicitly readmitted.
- [ ] Authorized repetition confirms only matching current admitted facts without new issuance, expiry, version or attribution. Conflicting bindings/states refuse; lost acknowledgement uses exact prepared actor lookup rather than a new ID.
- [ ] Zero responsibilities is valid; Contributor, Reviewer, Operations and Manager are independent combinable values. Unknown or duplicate responsibilities refuse. Manager alone grants no other responsibility; non-Managers cannot admit/edit/list others, and body claims never override authenticated identity.
- [ ] PATCH requires the observed membership version and desired label and/or complete responsibility set; forbid immutable-ID or implicit membership changes. Atomically recheck current Manager authority, version and last-Manager invariant. Actual changes increment membership version once, preserve credential revision unless credential state changes and record application-time actor ID/label; satisfied absolute state adds no timestamp/version/attribution. Stale incompatible edits return 409 and only permitted current facts.
- [ ] A lone Manager cannot remove their Manager responsibility; self-edits obey the same rules. Concurrency safety is part of this endpoint now, with expanded removal races in Ticket 03.
- [ ] Immutable first-admission actor/origin/time/label facts survive subsequent admitting-Manager relabeling/demotion. Duplicate labels are permitted and never identity; no unrestricted change history or purge API is added.
- [ ] GET self/exact actor and credential metadata apply self-versus-Manager access correctly; unauthorized callers receive no target facts. Never expose raw secrets or stored verifiers in roster/metadata output.
- [ ] Directory defaults to 50 and caps at 100; validate page sizes, exact actor-ID/membership filters and filter-bound continuation. Order by immutable first-admission time descending, then actor ID descending. Every page checks current Manager authority; inserts appear on refresh, current facts may change and a cursor grants no authority or frozen snapshot.
- [ ] Validate nonempty well-formed Unicode labels, reject controls, honor 80-code-point labels/128-code-point public IDs/512-code-point summaries without truncation or normalization. Distinguish format-valid values from maximum length. Bounded positive versions/revisions serialize as decimal strings and fail without wraparound on exhaustion.
- [ ] HTTP validates content type, recognized fields, required preconditions and well-formed JSON before mutation; configurable 16 KiB control-body guard produces 413. Provide specified 400/401/403/404/409/503 semantics, private no-store and explicit no-effect responses; no raw-secret control-body fields.
- [ ] Extend actor-specific curl documentation with admission, identity switching, exact lookup, alone/combined/zero-role assignments, directory continuation and stale-edit reconsideration.

## Verification to implement

Primary ownership: **M01-V03, M01-V06, M01-V15, M01-V16**. Contribute **M01-V04, M01-V05, M01-V07, M01-V13, M01-V17**. Tickets 01/03/04/06 supply the remaining authentication/membership/policy portions of V03; Ticket 03 completes removal/readmission portions of V06/V16; Tickets 04/07 complete credential and overflow/failure extensions of V15; Ticket 08 audits complete scenario coverage.

Automate actual HTTP admissions/edits/inspection with helper-prepared actors and real SQLite. Exercise all responsibility assignments and management denials, duplicate labels, descriptor conflicts and admission recovery. Use controlled barriers for competing edits/demotions and assert versions/latest attribution/no overwrite. Verify first-admission snapshots after the admitting Manager's relabeling. Create enough actors through supported operations for default/max pages and equal-time tie-breaks, insert between pages, alter current status when Ticket 03 exists and demote a Manager between pages. Validate filter/cursor mismatch, invalid page sizes, exact/excess Unicode limits, controls, malformed/unknown fields, oversized bodies and version exhaustion. Exhaustion may use a narrowly scoped test-construction fixture, never a production override or fabricated pass.

Manual verification: perform Manager admission and a zero-role member's self inspection/management denial, then refresh and reconsider a stale edit using documented JSON request files. No policy-only test substitutes for these real operations.

## Local evidence and deferred obligations

Local assignment/inspection/management evidence contributes to MF-AC-02/03/04; future capability permissions are verified as a contract in Ticket 06 and with real subjects in Modules 02–06. The actor directory does not fulfill later source/request/history listing acceptance. First-admission snapshots establish local historical-label evidence; dependency-pinned media provenance is deferred.

## Comments

2026-10-14 — Product Owner explicitly approved all eight tickets, their scope/dependencies/order, M01-V01–M01-V17 coverage, integration obligations and verification/handoff. Triage updated to `ready-for-agent`; This ticket remains dependency-blocked as recorded above. This session records approval only: no implementation or verification executed; all acceptance criteria remain unchecked.
